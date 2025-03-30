import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTruckById, getMenuById, getProducts } from '../../utils/supabaseService';
import ErrorMessage from '../../components/commonUI/ErrorMessage';
import OrderMenu from './OrderMenu';
import { Truck, Menu, Product } from '../../App';
import "../../styles/global.css";
function CustomerInterface() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [truck, setTruck] = useState<Truck | null>(null);
    const [menu, setMenu] = useState<Menu | null>(null);
    const [products, setProducts] = useState<Product[] | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    
    
    useEffect(() => {

        const truck_id_str = searchParams.get('truckId');
        let truck_id_int: number = -1;
        const fetchTruckById = async (truck_id: number) => {
            
            
            if (truck_id_str){
                truck_id_int = parseInt(truck_id_str);
            }
            const potentialTruck = await getTruckById(truck_id);
            if (!potentialTruck) {
                setErrorMessage("Could not find that truck! The QR code may be out of date....");
                return;
            }
            setTruck(potentialTruck);
        }
        fetchTruckById(truck_id_int);
    },[searchParams]);

    useEffect(() => {
        const fetchMenu = async () => {
            if (truck){
                if (truck.menu_id){
                    const potentialMenu = await getMenuById(truck.menu_id);
                    if (!potentialMenu){
                        setErrorMessage(`Could not get the menu for ${truck.truck_name}`);
                        return;
                    }
                    setMenu(potentialMenu);
                }
            }
        };
        fetchMenu();
    }, [truck])

    useEffect(() => {
        const fetchProducts = async () => {
            if(menu){
                const potentialProducts: Product[] | null = await getProducts(menu.menu_id);  
                if(!potentialProducts){
                    setErrorMessage(`Could not get the products for menu ${menu.menu_id}`);
                    return;
                }
                setProducts(potentialProducts);
            }
        }
        fetchProducts();
    }, [menu])
    


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    };

    const handleSubmit = () => {
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
        if (cleanedNumber.length === 10) {
            navigate('/order-menu',{ state:{cleanedNumber:cleanedNumber}});
        } else {
            alert("Please enter a valid 10-digit phone number.");
        }
    };

    return (
        <div>
            {truck && <p>Welcome to {truck.truck_name}! Enter phone number to order:</p>}
            <input 
                type="tel"
                value={phoneNumber}
                onChange={handleChange}
                placeholder="123-456-7890"
                maxLength={12}
            />
            <button onClick={handleSubmit}>Submit</button>
            {errorMessage !== "" && <ErrorMessage message={errorMessage}/>}
            {truck && <img src={truck.image_path}></img>}
            {menu && products && <OrderMenu menu={menu} products={products} />}

        </div>
    );
}

export default CustomerInterface;
