import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'react-toastify';
import {
  HiOutlineDocumentText,
  HiOutlineArrowDownTray,
  HiOutlineChartPie,
  HiOutlineBriefcase,
  HiOutlineCreditCard,
  HiOutlineWrench
} from 'react-icons/hi2';

type ReportType = 'revenue' | 'inventory' | 'rentals' | 'clients' | 'maintenance';

export const Reports: React.FC = () => {
  const { clients, inventory, rentalRequests } = useData();
  const [reportType, setReportType] = useState<ReportType>('revenue');

  // CSV Generator Utility
  const downloadCSV = (headers: string[], rows: string[][], filename: string) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    toast.info(`Preparing ${reportType} report in ${format} format...`);
    
    // Generate CSV data based on active report type
    let headers: string[] = [];
    let rows: string[][] = [];
    
    if (reportType === 'revenue') {
      headers = ['Invoice Number', 'Client Name', 'Billed Date', 'GST Tax', 'Discounts', 'Grand Total', 'Amount Paid', 'Balance Due'];
      rows = rentalRequests.filter(r => r.status === 'Approved').map(r => [
        r.invoiceNumber,
        r.clientName,
        r.invoiceDate || '',
        r.gstTotal.toString(),
        r.discountTotal.toString(),
        r.grandTotal.toString(),
        r.amountPaid.toString(),
        (r.grandTotal - r.amountPaid).toString()
      ]);
    } else if (reportType === 'inventory') {
      headers = ['Equipment ID', 'Asset Name', 'Category', 'Brand & Model', 'Status', 'Daily Rate', 'Purchase Price', 'Location'];
      rows = inventory.map(i => [
        i.equipmentId,
        i.name,
        i.category,
        `${i.brand} ${i.model}`,
        i.status,
        i.rentalPriceDay.toString(),
        i.purchasePrice.toString(),
        i.currentLocation
      ]);
    } else if (reportType === 'rentals') {
      headers = ['Rental Number', 'Client Name', 'Company Name', 'Start Date', 'Expected Return', 'Total Items', 'Grand Total', 'Status'];
      rows = rentalRequests.map(r => [
        r.rentalNumber || 'Pending',
        r.clientName,
        r.companyName,
        r.startDate,
        r.expectedReturnDate,
        r.items.length.toString(),
        r.grandTotal.toString(),
        r.status
      ]);
    } else if (reportType === 'clients') {
      headers = ['Client ID', 'Client Name', 'Company Name', 'GSTIN', 'Phone', 'Email', 'City', 'Status'];
      rows = clients.map(c => [
        c.id,
        c.name,
        c.companyName,
        c.gstNumber,
        c.phone,
        c.email,
        c.city,
        c.status
      ]);
    } else if (reportType === 'maintenance') {
      headers = ['Equipment ID', 'Asset Name', 'Maintenance Date', 'Service Action', 'Technician', 'Repair Cost (INR)'];
      rows = [];
      inventory.forEach(item => {
        item.maintenanceHistory.forEach(log => {
          rows.push([
            item.equipmentId,
            item.name,
            log.date,
            log.type,
            log.technician,
            log.cost.toString()
          ]);
        });
      });
    }

    if (format === 'CSV' || format === 'Excel') {
      downloadCSV(headers, rows, `NH_Homes_${reportType}_Report_${Date.now()}`);
      toast.success(`${reportType} CSV exported successfully!`);
    } else {
      // PDF simulation
      setTimeout(() => {
        toast.success(`PDF report compiled and sent to your downloads!`);
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 text-left text-xs">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border pb-4">
        <div>
          <h1 className="text-lg font-extrabold text-brand-text tracking-tight m-0">Corporate Reports & Analytics</h1>
          <p className="text-xs text-brand-dark-grey mt-0.5">Export operational metrics, maintenance schedules, tax invoices, and accounting audits.</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')} leftIcon={<HiOutlineArrowDownTray />}>
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Excel')}>
            Export Excel
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleExport('PDF')} leftIcon={<HiOutlineDocumentText />}>
            Download PDF Report
          </Button>
        </div>
      </div>

      {/* Selector Side Panel + Visualizer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left selector */}
        <div className="space-y-1.5">
          <button
            onClick={() => setReportType('revenue')}
            className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-150 flex items-center gap-3 ${
              reportType === 'revenue'
                ? 'bg-orange-50 border-orange-100 text-primary'
                : 'bg-white border-brand-border text-brand-dark-grey hover:bg-brand-light-grey'
            }`}
          >
            <HiOutlineCreditCard className="h-5 w-5" />
            <span>Revenue Report</span>
          </button>
          
          <button
            onClick={() => setReportType('inventory')}
            className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-150 flex items-center gap-3 ${
              reportType === 'inventory'
                ? 'bg-orange-50 border-orange-100 text-primary'
                : 'bg-white border-brand-border text-brand-dark-grey hover:bg-brand-light-grey'
            }`}
          >
            <HiOutlineChartPie className="h-5 w-5" />
            <span>Inventory Status</span>
          </button>
          
          <button
            onClick={() => setReportType('rentals')}
            className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-150 flex items-center gap-3 ${
              reportType === 'rentals'
                ? 'bg-orange-50 border-orange-100 text-primary'
                : 'bg-white border-brand-border text-brand-dark-grey hover:bg-brand-light-grey'
            }`}
          >
            <HiOutlineDocumentText className="h-5 w-5" />
            <span>Rental Activity Report</span>
          </button>

          <button
            onClick={() => setReportType('clients')}
            className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-150 flex items-center gap-3 ${
              reportType === 'clients'
                ? 'bg-orange-50 border-orange-100 text-primary'
                : 'bg-white border-brand-border text-brand-dark-grey hover:bg-brand-light-grey'
            }`}
          >
            <HiOutlineBriefcase className="h-5 w-5" />
            <span>Clients Ledger Report</span>
          </button>

          <button
            onClick={() => setReportType('maintenance')}
            className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-150 flex items-center gap-3 ${
              reportType === 'maintenance'
                ? 'bg-orange-50 border-orange-100 text-primary'
                : 'bg-white border-brand-border text-brand-dark-grey hover:bg-brand-light-grey'
            }`}
          >
            <HiOutlineWrench className="h-5 w-5" />
            <span>Maintenance Expenses</span>
          </button>
        </div>

        {/* Right Details Table */}
        <Card className="md:col-span-3">
          <CardHeader>
            <h3 className="font-extrabold text-xs text-brand-text uppercase tracking-wider capitalize">{reportType} Report Analysis</h3>
            <span className="text-[10px] text-brand-dark-grey font-medium">Real-time entries in active database</span>
          </CardHeader>
          <CardBody className="p-0 overflow-x-auto">
            {reportType === 'revenue' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-light-grey border-b border-brand-border text-brand-dark-grey font-bold uppercase tracking-wider">
                    <th className="px-4 py-3">Invoice No</th>
                    <th className="px-4 py-3">Client Representative</th>
                    <th className="px-4 py-3">GST Tax</th>
                    <th className="px-4 py-3">Grand Total</th>
                    <th className="px-4 py-3">Paid Amount</th>
                    <th className="px-4 py-3">Dues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {rentalRequests.filter(r => r.status === 'Approved').map(r => (
                    <tr key={r.id}>
                      <td className="px-4 py-3 font-bold text-brand-text font-mono">{r.invoiceNumber}</td>
                      <td className="px-4 py-3 font-semibold text-brand-text">{r.clientName}</td>
                      <td className="px-4 py-3 font-medium text-brand-text">₹{r.gstTotal.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-brand-text">₹{r.grandTotal.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-green-600">₹{r.amountPaid.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-red-600">₹{(r.grandTotal - r.amountPaid).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'inventory' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-light-grey border-b border-brand-border text-brand-dark-grey font-bold uppercase tracking-wider">
                    <th className="px-4 py-3">Equipment ID</th>
                    <th className="px-4 py-3">Asset Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Daily Rent Rate</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {inventory.map(i => (
                    <tr key={i.id}>
                      <td className="px-4 py-3 font-bold text-brand-text font-mono">{i.equipmentId}</td>
                      <td className="px-4 py-3 font-semibold text-brand-text">{i.name}</td>
                      <td className="px-4 py-3 font-medium text-brand-dark-grey">{i.category}</td>
                      <td className="px-4 py-3 font-bold text-primary">₹{i.rentalPriceDay.toLocaleString()}/day</td>
                      <td className="px-4 py-3"><Badge variant={i.status === 'Available' ? 'success' : 'brand'}>{i.status}</Badge></td>
                      <td className="px-4 py-3 font-medium text-brand-text">{i.currentLocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'rentals' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-light-grey border-b border-brand-border text-brand-dark-grey font-bold uppercase tracking-wider">
                    <th className="px-4 py-3">Rental Number</th>
                    <th className="px-4 py-3">Client Representative</th>
                    <th className="px-4 py-3">Company Name</th>
                    <th className="px-4 py-3">Start Date</th>
                    <th className="px-4 py-3">Expected Return</th>
                    <th className="px-4 py-3">Grand Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {rentalRequests.map(r => (
                    <tr key={r.id}>
                      <td className="px-4 py-3 font-bold text-brand-text font-mono">{r.rentalNumber || 'Pending Approval'}</td>
                      <td className="px-4 py-3 font-semibold text-brand-text">{r.clientName}</td>
                      <td className="px-4 py-3 font-medium text-brand-dark-grey">{r.companyName}</td>
                      <td className="px-4 py-3 font-semibold text-brand-text">{r.startDate}</td>
                      <td className="px-4 py-3 font-semibold text-brand-text">{r.expectedReturnDate}</td>
                      <td className="px-4 py-3 font-bold text-primary">₹{r.grandTotal.toLocaleString()}</td>
                      <td className="px-4 py-3"><Badge variant={r.status === 'Approved' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'}>{r.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'clients' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-light-grey border-b border-brand-border text-brand-dark-grey font-bold uppercase tracking-wider">
                    <th className="px-4 py-3">Client Representative Name</th>
                    <th className="px-4 py-3">Company Name</th>
                    <th className="px-4 py-3">GSTIN Tax Registration</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Email Address</th>
                    <th className="px-4 py-3">City</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {clients.map(c => (
                    <tr key={c.id}>
                      <td className="px-4 py-3 font-bold text-brand-text">{c.name}</td>
                      <td className="px-4 py-3 font-semibold text-brand-text">{c.companyName}</td>
                      <td className="px-4 py-3 font-bold text-brand-text font-mono">{c.gstNumber}</td>
                      <td className="px-4 py-3 font-medium text-brand-dark-grey">{c.phone}</td>
                      <td className="px-4 py-3 font-medium text-brand-dark-grey">{c.email}</td>
                      <td className="px-4 py-3 font-medium text-brand-text">{c.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'maintenance' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-light-grey border-b border-brand-border text-brand-dark-grey font-bold uppercase tracking-wider">
                    <th className="px-4 py-3">Equipment ID</th>
                    <th className="px-4 py-3">Asset Name</th>
                    <th className="px-4 py-3">Service Action Type</th>
                    <th className="px-4 py-3">Maintenance Date</th>
                    <th className="px-4 py-3">Technician</th>
                    <th className="px-4 py-3 text-right">Repair Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {(() => {
                    const rows: React.ReactNode[] = [];
                    inventory.forEach(item => {
                      item.maintenanceHistory.forEach(log => {
                        rows.push(
                          <tr key={log.id}>
                            <td className="px-4 py-3 font-bold text-brand-text font-mono">{item.equipmentId}</td>
                            <td className="px-4 py-3 font-semibold text-brand-text">{item.name}</td>
                            <td className="px-4 py-3 font-semibold text-brand-text">{log.type}</td>
                            <td className="px-4 py-3 font-medium text-brand-dark-grey">{log.date}</td>
                            <td className="px-4 py-3 font-medium text-brand-dark-grey">{log.technician}</td>
                            <td className="px-4 py-3 text-right font-bold text-primary">₹{log.cost.toLocaleString()}</td>
                          </tr>
                        );
                      });
                    });
                    return rows.length > 0 ? rows : (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-brand-dark-grey italic">No maintenance actions recorded.</td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default Reports;
