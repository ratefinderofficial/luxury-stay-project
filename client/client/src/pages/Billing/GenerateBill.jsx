import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Printer, Plus, Trash2, Search, Save, FileText, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const GenerateBill = () => {
  // --- STATE ---
  const [loading, setLoading] = useState(false);
  const [taxRate, setTaxRate] = useState(0); 
  const [searchId, setSearchId] = useState(''); 
  
  const [booking, setBooking] = useState(null); 
  const [extraServices, setExtraServices] = useState([]);
  
  // Naya Item add karne ke liye state
  const [newItem, setNewItem] = useState({ name: '', price: '' });

  // --- 1. FETCH TAX SETTINGS ---
  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/settings')
      .then(res => setTaxRate(res.data.taxRate || 0))
      .catch(err => console.log("Error fetching tax:", err));
  }, []);

  // --- 2. SEARCH BOOKING ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if(!searchId) return toast.error("Please enter a Booking ID");
    
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/billing/search/${searchId}`);
      setBooking(res.data);
      setExtraServices([]); // Purane extras hatao
      toast.success("Guest Found!");
    } catch (error) {
      toast.error("Booking not found! Check ID.");
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. ADD ITEM (FIXED ✅) ---
  const addService = (e) => {
    e.preventDefault();
    
    // Check karo input khali to nahi
    if (!newItem.name || !newItem.price) {
        return toast.error("Please enter Name and Price");
    }
    
    const service = { 
        id: Date.now(), // Unique ID
        name: newItem.name, 
        price: parseFloat(newItem.price) // Number mein convert karo
    };

    // List mein add karo
    setExtraServices([...extraServices, service]);
    
    // Input boxes khali karo
    setNewItem({ name: '', price: '' });
    toast.success("Item Added");
  };

  // Remove Item
  const removeService = (id) => {
    setExtraServices(extraServices.filter(item => item.id !== id));
  };

  // --- 4. AUTOMATIC CALCULATIONS ---
  const calculateBill = () => {
    if (!booking) return { roomTotal: 0, servicesTotal: 0, subTotal: 0, taxAmount: 0, grandTotal: 0, nights: 0 };

    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const roomTotal = (booking.room?.price || 0) * nights;
    const servicesTotal = extraServices.reduce((sum, item) => sum + item.price, 0);
    const subTotal = roomTotal + servicesTotal;
    const taxAmount = (subTotal * taxRate) / 100;
    const grandTotal = subTotal + taxAmount;

    return { roomTotal, servicesTotal, subTotal, taxAmount, grandTotal, nights };
  };

  const { roomTotal, subTotal, taxAmount, grandTotal, nights } = calculateBill();

  // --- 5. SAVE TO DATABASE (FIXED) ---
  const handleSaveInvoice = async () => {
    if(!booking) return;
    if(!window.confirm("Are you sure you want to save this bill?")) return;

    // ✅ SAFE DATA EXTRACTION
    // Kabhi data 'guest' object mein hota hai, kabhi seedha root par. Dono check karo.
    const safeGuestName = booking.guestName || booking.guest?.name || "Unknown Guest";
    const safeRoomNumber = booking.roomNumber || booking.room?.roomNumber || "N/A";

    const invoiceData = {
        bookingId: booking._id,
        guestName: safeGuestName, 
        roomNumber: safeRoomNumber,
        items: [
            { 
              description: `Room Charge (${nights} Nights)`, 
              amount: roomTotal, 
              qty: nights 
            },
            ...extraServices.map(s => ({ 
              description: s.name, 
              amount: s.price, 
              qty: 1 
            }))
        ],
        subTotal: subTotal,
        taxAmount: taxAmount,
        totalAmount: grandTotal,
        status: 'Paid' 
    };

    try {
        console.log("📤 Sending Data:", invoiceData); // Console mein check karo kya bhej rahe ho
        await axios.post('http://localhost:5000/api/v1/billing', invoiceData);
        toast.success("✅ Invoice Saved Successfully!");
        
        // Reset
        setBooking(null);
        setExtraServices([]);
        setSearchId('');

    } catch (error) {
        console.error("Save Error:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to save invoice");
    }
  };
  const handlePrint = () => window.print();

  // --- STYLES ---
  const styles = {
    container: { padding: '30px', backgroundColor: '#f3f4f6', height: 'calc(100vh - 80px)', overflowY: 'auto', fontFamily: 'Segoe UI, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937' },
    searchBox: { backgroundColor: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', gap: '10px', alignItems: 'center' },
    searchInput: { flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' },
    searchBtn: { backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    layout: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
    controlPanel: { flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: 'fit-content' },
    invoicePaper: { flex: '1.5', minWidth: '350px', backgroundColor: 'white', padding: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: '#1f2937' },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: '20px', marginTop: '20px' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '1px solid #000', fontWeight: 'bold' },
    td: { padding: '12px', borderBottom: '1px solid #eee' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '10px' },
    addButton: { width: '100%', padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '5px' },
    printBtn: { backgroundColor: '#1f2937', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', gap: '8px', alignItems:'center' }
  };

  return (
    <div style={styles.container}>
      <style>{`@media print { .no-print { display: none !important; } #invoice-area { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; } }`}</style>

      {/* Header */}
      <div style={styles.header} className="no-print">
        <div>
            <h1 style={styles.title}>Generate Bill</h1>
            <p style={{color: '#6b7280'}}>Manage invoices and print bills.</p>
        </div>
        <div style={{display:'flex', gap: '10px'}}>
             {booking && (
                <button onClick={handleSaveInvoice} style={{...styles.printBtn, backgroundColor: '#2563eb'}}>
                    <Save size={18}/> Save Bill
                </button>
             )}
            <button onClick={handlePrint} style={styles.printBtn}>
                <Printer size={18}/> Print
            </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={styles.searchBox} className="no-print">
        <Search size={20} color="#666"/>
        <input 
            type="text" 
            placeholder="Enter Booking ID (e.g. 64b8f...)" 
            style={styles.searchInput}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch} style={styles.searchBtn} disabled={loading}>
            {loading ? "Searching..." : "Search Guest"}
        </button>
      </div>

      <div style={styles.layout}>
        
        {/* LEFT: ADD SERVICES FORM (Fixed) */}
        <div style={{...styles.controlPanel, opacity: booking ? 1 : 0.5, pointerEvents: booking ? 'all' : 'none'}} className="no-print">
            <h3 style={{fontWeight: 'bold', marginBottom: '15px'}}>Add Extra Charges</h3>
            <form onSubmit={addService}>
                <label style={{display:'block', fontSize:'13px', marginBottom:'5px', color:'#666'}}>Service Name</label>
                <input 
                    type="text" 
                    placeholder="e.g. Laundry, Transport" 
                    style={styles.input} 
                    value={newItem.name} 
                    onChange={e => setNewItem({...newItem, name: e.target.value})} 
                />
                
                <label style={{display:'block', fontSize:'13px', marginBottom:'5px', color:'#666'}}>Price ($)</label>
                <input 
                    type="number" 
                    placeholder="0.00" 
                    style={styles.input} 
                    value={newItem.price} 
                    onChange={e => setNewItem({...newItem, price: e.target.value})} 
                />
                
                <button type="submit" style={styles.addButton}><Plus size={18}/> Add Item</button>
            </form>
        </div>

        {/* RIGHT: INVOICE PAPER */}
        <div id="invoice-area" style={styles.invoicePaper}>
            
            {/* Invoice Header */}
            <div style={{display:'flex', justifyContent:'space-between', borderBottom:'2px solid #333', paddingBottom:'20px'}}>
                <div>
                    <h1 style={{fontSize:'28px', fontWeight:'bold'}}>LuxuryStay</h1>
                    <p style={{fontSize:'12px', color:'#666'}}>123 Luxury Ave, Beverly Hills</p>
                </div>
                <div style={{textAlign:'right'}}>
                    <h2 style={{fontSize:'24px', fontWeight:'bold', color:'#ddd'}}>INVOICE</h2>
                    <p style={{fontSize:'12px'}}>Date: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {!booking ? (
                <div style={{textAlign: 'center', padding: '50px', color: '#999'}}>
                    <FileText size={40} style={{opacity: 0.2, marginBottom: 10}}/>
                    <p>Search a booking to generate invoice.</p>
                </div>
            ) : (
                <>
                    {/* Guest Details */}
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', marginTop:'30px', fontSize:'14px'}}>
                        <div>
                            <p style={{fontWeight:'bold'}}>BILL TO:</p>
                            <p>{booking.guest?.name || 'Guest'}</p>
                            <p>Room: {booking.room?.roomNumber || 'N/A'}</p>
                        </div>
                        <div style={{textAlign:'right'}}>
                            <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                            <p>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Bill Table */}
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Description</th>
                                <th style={{...styles.th, textAlign:'right'}}>Amount</th>
                                <th style={styles.th} className="no-print"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={styles.td}>Room Charge ({nights} Nights)</td>
                                <td style={{...styles.td, textAlign:'right'}}>${roomTotal.toFixed(2)}</td>
                                <td style={styles.td}></td>
                            </tr>
                            {extraServices.map((item) => (
                                <tr key={item.id}>
                                    <td style={styles.td}>{item.name}</td>
                                    <td style={{...styles.td, textAlign:'right'}}>${item.price.toFixed(2)}</td>
                                    <td style={styles.td} className="no-print">
                                        <button onClick={() => removeService(item.id)} style={{background:'none', border:'none', color:'red', cursor:'pointer'}}><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals Section */}
                    <div style={{display:'flex', justifyContent:'flex-end', marginTop:'20px'}}>
                        <div style={{width:'250px'}}>
                            <div style={{display:'flex', justifyContent:'space-between', padding:'5px 0'}}><span>Subtotal:</span> <span>${subTotal.toFixed(2)}</span></div>
                            <div style={{display:'flex', justifyContent:'space-between', padding:'5px 0'}}><span>Tax ({taxRate}%):</span> <span>${taxAmount.toFixed(2)}</span></div>
                            <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderTop:'2px solid #000', fontWeight:'bold', fontSize:'18px'}}>
                                <span>TOTAL:</span> <span>${grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div style={{marginTop:'50px', textAlign:'center', fontSize:'12px', color:'#999'}}>
                <p>Thank you for choosing LuxuryStay Hospitality.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateBill;