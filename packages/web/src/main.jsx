import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Start from './pages/Start/Start';
import Order from './pages/Order/Order';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';
import PaymentFail from './pages/PaymentFail/PaymentFail';
import Status from './pages/Status/Status';
import See from './pages/See/See';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/start' element={<Start />} />
            <Route path='/order' element={<Order />} />
            <Route path='/payment-success' element={<PaymentSuccess />} />
            <Route path='/payment-fail' element={<PaymentFail />} />
            <Route path='/status' element={<Status />} />
            <Route path='/see' element={<See />} />
        </Routes>
    </BrowserRouter>
);
