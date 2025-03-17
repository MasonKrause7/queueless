import '../../styles/kitchen/cookDashboard.css';
import type { OrderDTO } from '../../pages/kitchen/CookDashboard';

type OrderListProps = {
    orders: OrderDTO[]
}


const OrderList: React.FC<OrderListProps> = ({ orders }) => {
    return (
        <ul className="orderList">
            {orders.map((order: OrderDTO) => (
                <li className="listItem" key={order.order_id}>
                    <div className="listLeft">
                        <ul>
                            <li>Time Submitted: {new Date(order.time_received).toLocaleTimeString()}</li>
                            <li>Status: {order.status}</li>
                        </ul>
                    </div>
                    <div className="listRight">
                        <button className="listButton">View Details</button>
                    </div>
                </li>
            ))}
        </ul>
    );
};



export default OrderList;