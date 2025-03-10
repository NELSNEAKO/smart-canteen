import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    // const url = "https://smart-canteen-backend.onrender.com";
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
            await axios.post(url + '/api/cart/add', {itemId}, {headers:{token}});
        }
    };

    const removeFromCart = async (itemId) => {
       setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + '/api/cart/remove', {itemId}, {headers:{token}});
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) 
        {
            if(cartItems[item] > 0){
                let itemInfo = food_list.find((product)=> product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        const response = await axios.get(url + '/api/food/list');
        setFoodList(response.data.data);
        console.log("Food list:", response.data.data);
        
    };
    const fetchTopList = async () => {
        const response = await axios.get(`${url}/api/food/top`);
        setTopList(response.data.data);
        // console.log("Top list:", response.data.data);
    };

    const loadCartData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token missing");
                return;
            }
    
            const response = await axios.post(
                url + '/api/cart/get', 
                {}, // Empty body since middleware extracts userId
                { headers: { token } } // Auth middleware will handle user extraction
            );
    
            if (response.data.success) {
                setCartItems(response.data.cartData);
            } else {
                console.error("Failed to fetch cart:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };
    
    useEffect(() => {
        async function fetchData() {
            await fetchFoodList();
            await fetchTopList();
            if (localStorage.getItem('token')) {
                setToken(localStorage.getItem('token'));
                await loadCartData(); // Calls API with middleware handling userId
            }
        }
        fetchData();
        // console.log('cart items', cartItems);
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
