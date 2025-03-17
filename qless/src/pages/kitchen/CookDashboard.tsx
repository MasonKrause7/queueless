import OrderList from '../../components/kitchen/OrderList';
import '../../styles/kitchen/cookDashboard.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabase';



/*Order Status:
    1: Recieved
    2: Being Cooked
    3: Ready
    4: Picked Up
*/
export type Employee = {
    first_name: string,
    last_name: string,
    email: string,
    employee_id: string
}

type Order = {
    order_id:number,
    subtotal: number,
    tax_rate: number,
    customer_phone_number: string,
    time_received: Date,
    time_being_cooked: Date | null,
    time_ready: Date | null,
    time_picked_up: Date | null,
    status_id: number
}
export type OrderDTO = {
    order_id: number,
    status: string,
    customer_phone_number: string,
    time_received: Date,
    time_being_cooked: Date | null,
    time_ready: Date | null,
    time_picked_up: Date | null    
}




const CookDashboard: React.FC = () => {
    const [isShowing, setIsShowing] = useState("list");
    const [orders, setOrders] = useState<OrderDTO[]>([]);
    
    const navigation = useNavigate();
    const location = useLocation();
    const employeeData = location.state?.employee;
    let employee: Employee = {
        first_name: "",
        last_name: "",
        email: "",
        employee_id: ""
    };
    if (!employeeData){
        //redirect to login
        navigation('/');
    }
    else{
        employee = {
            first_name: employeeData.first_name,
            last_name: employeeData.last_name,
            email: employeeData.email,
            employee_id: employeeData.user_id
        }
    }
    

    
    function getOrderStatus(id: number) {
        let status = "";
        switch (id) {
            case 1:
                status = "Recieved"
                break;
            case 2:
                status = "Being Cooked"
                break;
            case 3:
                status = "Ready"
                break;
            case 4:
                status = "Picked Up"
                break;
        }
        return status;
    }

    useEffect(() => {
        const fetchOrders = async () => {
            try{
                
                const { data, error } = await supabase.from('orders').select('*');
                if (data){
                    console.log("got the orders, ", data)
                    const orderList: OrderDTO[] = data.map((order: Order) => ({
                        order_id: order.order_id,
                        subtotal: order.subtotal,
                        tax_rate: order.tax_rate,
                        customer_phone_number: order.customer_phone_number,
                        time_received: order.time_received,
                        time_being_cooked: order.time_being_cooked,
                        time_ready: order.time_ready,
                        time_picked_up: order.time_picked_up,
                        status: getOrderStatus(order.status_id),
                    }));
                    setOrders(orderList);
                }
                else if (error) {
                    console.log("Error fetching orders.: ", error.code);
                    console.log(error.message);
                }
            }
            catch (err) {
                console.log("Unable to complete the fetch orders process... ", err);
            }
        }
        fetchOrders();
    }, []);


    return (
        <div className="pageContainer">
            <div className='cookDashContainer'>
                <div className="cookDashLeft">
                    {isShowing === "list" && <OrderList orders={orders} />}
                    {isShowing === "details" && <DetailsButton setIsShowing={setIsShowing} />}
                </div>
                <div className="cookDashRight">
                    <p>Just For Testing</p>
                </div>
                {isShowing === "finish" && <FinishButton setIsShowing={setIsShowing} />}
            </div>
        </div>
    )
}


export default CookDashboard;


type cookDashButtonProps = {
    setIsShowing: React.Dispatch<React.SetStateAction<string>>,
}

const DetailsButton: React.FC<cookDashButtonProps> = ({ setIsShowing }) => {
    return (
        <>
            <button onClick={() => setIsShowing("details")}>Back</button>
        </>
    );
}



const FinishButton: React.FC<cookDashButtonProps> = ({ setIsShowing }) => {
    return (
        <>
            
            <button onClick={() => setIsShowing("list")}>Back</button>
        </>
    );
}

