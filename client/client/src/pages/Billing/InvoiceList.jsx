import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Download, Eye, FileText, ChevronLeft, ChevronRight, Filter, Loader } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';

// Components
import PageHeader from '../../components/Layout/PageHeader';

const InvoiceList = () => {
  const navigate = useNavigate();
  
  // States
  const [invoices, setInvoices] = useState([]); // Data yahan store hoga
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // --- 1. FETCH INVOICES (Direct Axios Call) ---
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        // Query Params banao
        const query = new URLSearchParams();
        if (searchTerm) query.append('search', searchTerm);
        if (statusFilter) query.append('status', statusFilter);

        const res = await axios.get(`http://localhost:5000/api/v1/billing?${query.toString()}`);
        
        // 🟢 FIX: Data check karo (Array hai ya Object)
        if (Array.isArray(res.data)) {
            setInvoices(res.data);
        } else if (res.data.invoices) {
            setInvoices(res.data.invoices);
        } else {
            setInvoices([]);
        }

      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };

    // Debounce (Type karne ke bad thoda ruk kar call kare)
    const timer = setTimeout(() => {
        fetchInvoices();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  // Handle PDF Download
  const handleDownload = (id) => {
      toast.success("Downloading Invoice PDF...");
      // Future: window.open(`http://localhost:5000/api/v1/billing/pdf/${id}`, '_blank');
  };

  // --- STYLES ---
  const styles = {
    container: { padding: '30px', backgroundColor: '#f8fafc', height: 'calc(100vh - 80px)', overflowY: 'auto', fontFamily: "'Segoe UI', sans-serif" },
    filterCard: { backgroundColor: 'white', padding: '15px 20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' },
    searchContainer: { display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '8px 15px', width: '350px', border: '1px solid #e2e8f0' },
    input: { border: 'none', background: 'transparent', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '14px', color: '#334155' },
    select: { padding: '8px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontSize: '14px', outline: 'none', cursor: 'pointer' },
    
    tableContainer: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { backgroundColor: '#f8fafc', padding: '16px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' },
    td: { padding: '16px', borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '14px' },
    row: { transition: 'background-color 0.2s' },
    
    badge: (status) => {
      let bg = '#e2e8f0', color = '#475569';
      if(status === 'Paid') { bg = '#dcfce7'; color = '#166534'; }
      if(status === 'Pending') { bg = '#fef9c3'; color = '#854d0e'; }
      return { backgroundColor: bg, color: color, padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', display: 'inline-block' };
    },
    actionBtn: { padding: '8px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' },
    createBtn: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }
  };

  return (
    <div style={styles.container}>
      
      <PageHeader 
        title="Invoices & Billing" 
        subtitle="Manage guest payments and financial records"
        breadcrumbs={['Dashboard', 'Billing']}
        action={
          <button style={styles.createBtn} onClick={() => navigate('/billing/generate')}>
            <Plus size={18} /> Generate New Bill
          </button>
        }
      />

      {/* Filters */}
      <div style={styles.filterCard}>
        <div style={styles.searchContainer}>
          <Search size={18} color="#94a3b8" />
          <input type="text" placeholder="Search Invoice # or Guest..." style={styles.input} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <Filter size={16} color="#64748b"/>
            <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
            </select>
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        {loading ? (
          <div style={{padding: '50px', textAlign: 'center'}}><Loader className="animate-spin mx-auto text-blue-600"/></div>
        ) : invoices.length === 0 ? (
          <div style={{padding: '60px', textAlign: 'center', color: '#94a3b8'}}>
             <FileText size={48} style={{margin:'0 auto 15px', opacity:0.3}}/>
             <h3>No invoices found</h3>
             <p>Generate a new bill to see it here.</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice #</th>
                <th style={styles.th}>Guest Name</th>
                <th style={styles.th}>Room</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={{...styles.th, textAlign: 'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} style={styles.row} onMouseEnter={(e)=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseLeave={(e)=>e.currentTarget.style.backgroundColor='white'}>
                  <td style={styles.td}>
                     <span style={{fontFamily: 'monospace', fontWeight: 'bold', color: '#2563eb'}}>
                        #{inv.invoiceNumber || inv.bookingCode || 'INV'}
                     </span>
                  </td>
                  <td style={{...styles.td, fontWeight: '500'}}>{inv.guestName}</td>
                  <td style={styles.td}>{inv.roomNumber}</td>
                  <td style={styles.td}>{format(new Date(inv.issuedDate), 'MMM dd, yyyy')}</td>
                  <td style={{...styles.td, fontWeight: 'bold'}}>${inv.totalAmount?.toFixed(2)}</td>
                  <td style={styles.td}><span style={styles.badge(inv.status)}>{inv.status}</span></td>
                  <td style={{...styles.td, textAlign: 'right'}}>
                    <button style={styles.actionBtn} onClick={() => handleDownload(inv._id)} title="Download"><Download size={18} /></button>
                    {/* <button style={styles.actionBtn} title="View"><Eye size={18} /></button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;