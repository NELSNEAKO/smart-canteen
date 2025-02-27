import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:5000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [topList, setTopList] = useState([]);

    const addToCart = async (itemId) => {
       if (!cartItems[itemId]) {
            setCartItems((prev) =>  ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + '/api/reservation/add', {itemId}, {headers:{token}});
        }
    };

    const removeFromCart = async (itemId) => {
       setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + '/api/reservation/remove', {itemId}, {headers:{token}});
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product.id === parseInt(item));
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        const response = await axios.get(url + '/api/food/list');
        setFoodList(response.data.data);
        // console.log("Food list:", response.data.data);
        
    };
    const fetchTopList = async () => {
        const response = await axios.get(`${url}/api/food/top`);
        setTopList(response.data.data);
        // console.log("Top list:", response.data.data);
    };

    const loadCartData = async () => {
        const storedToken = localStorage.getItem('token');
    
        if (!storedToken) {
            console.error("Token is missing from localStorage!");
            return;
        }
    
        try {
            const response = await axios.get(`${url}/api/reservation/get`, {
                headers: { token: storedToken }
            });
    
            // console.log("Response data:", response.data);
    
            // Convert the array into an object with itemId as keys
            const cartObject = response.data.reduce((acc, item) => {
                acc[item.itemId] = item.quantity;
                return acc;
            }, {});
    
            setCartItems(cartObject); // Now cartItems will be an object like { 1: 2, 2: 3 }
        } catch (error) {
            console.error("Error loading cart data:", error.response?.data || error);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            await fetchTopList();
            if (localStorage.getItem('token')) {
                setToken(localStorage.getItem('token'));
                await loadCartData();
            }
        }
        loadData();
    }, []);


    const contextValue = {
        food_list,
        topList,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;