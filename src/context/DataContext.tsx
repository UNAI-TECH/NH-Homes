import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Employee, Client, InventoryItem, RentalRequest, ActivityLog, SystemSettings, AdditionalCharges } from '../types';
import { mockEmployees, mockClients, mockInventory, mockRentalRequests, mockActivityLogs, defaultSystemSettings } from '../data/mockData';

interface DataContextType {
  employees: Employee[];
  clients: Client[];
  inventory: InventoryItem[];
  rentalRequests: RentalRequest[];
  activityLogs: ActivityLog[];
  settings: SystemSettings;
  
  // Employee Actions
  addEmployee: (employee: Omit<Employee, 'id' | 'employeeId'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  // Client Actions
  addClient: (client: Omit<Client, 'id' | 'rentalHistory' | 'paymentHistory'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Inventory Actions
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'equipmentId' | 'qrCode' | 'barcode' | 'maintenanceHistory' | 'rentalHistory'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  
  // Rental Actions
  submitRentalRequest: (request: Omit<RentalRequest, 'id' | 'rentalNumber' | 'invoiceNumber' | 'status' | 'createdAt' | 'amountPaid'>) => void;
  approveRentalRequest: (id: string, additionalCharges: AdditionalCharges, discountTotal: number, gstTotal: number, grandTotal: number) => void;
  rejectRentalRequest: (id: string) => void;
  recordPayment: (id: string, amount: number, method: 'UPI' | 'Cash' | 'Cheque' | 'Bank Transfer') => void;
  
  // Settings Actions
  updateSettings: (settings: SystemSettings) => void;
  logActivity: (user: string, role: 'admin' | 'employee' | 'client', action: string, type: ActivityLog['type'], details: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(defaultSystemSettings);

  // Initialize data from localStorage or mockData
  useEffect(() => {
    const localEmployees = localStorage.getItem('nh_homes_db_v2_employees');
    const localClients = localStorage.getItem('nh_homes_db_v2_clients');
    const localInventory = localStorage.getItem('nh_homes_db_v2_inventory');
    const localRentals = localStorage.getItem('nh_homes_db_v2_rentals');
    const localLogs = localStorage.getItem('nh_homes_db_v2_logs');
    const localSettings = localStorage.getItem('nh_homes_db_v2_settings');

    if (localEmployees) setEmployees(JSON.parse(localEmployees));
    else { setEmployees(mockEmployees); localStorage.setItem('nh_homes_db_v2_employees', JSON.stringify(mockEmployees)); }

    if (localClients) setClients(JSON.parse(localClients));
    else { setClients(mockClients); localStorage.setItem('nh_homes_db_v2_clients', JSON.stringify(mockClients)); }

    if (localInventory) setInventory(JSON.parse(localInventory));
    else { setInventory(mockInventory); localStorage.setItem('nh_homes_db_v2_inventory', JSON.stringify(mockInventory)); }

    if (localRentals) setRentalRequests(JSON.parse(localRentals));
    else { setRentalRequests(mockRentalRequests); localStorage.setItem('nh_homes_db_v2_rentals', JSON.stringify(mockRentalRequests)); }

    if (localLogs) setActivityLogs(JSON.parse(localLogs));
    else { setActivityLogs(mockActivityLogs); localStorage.setItem('nh_homes_db_v2_logs', JSON.stringify(mockActivityLogs)); }

    if (localSettings) setSettings(JSON.parse(localSettings));
    else { setSettings(defaultSystemSettings); localStorage.setItem('nh_homes_db_v2_settings', JSON.stringify(defaultSystemSettings)); }
  }, []);

  // Sync state helpers
  const saveEmployees = (data: Employee[]) => { setEmployees(data); localStorage.setItem('nh_homes_db_v2_employees', JSON.stringify(data)); };
  const saveClients = (data: Client[]) => { setClients(data); localStorage.setItem('nh_homes_db_v2_clients', JSON.stringify(data)); };
  const saveInventory = (data: InventoryItem[]) => { setInventory(data); localStorage.setItem('nh_homes_db_v2_inventory', JSON.stringify(data)); };
  const saveRentals = (data: RentalRequest[]) => { setRentalRequests(data); localStorage.setItem('nh_homes_db_v2_rentals', JSON.stringify(data)); };
  const saveLogs = (data: ActivityLog[]) => { setActivityLogs(data); localStorage.setItem('nh_homes_db_v2_logs', JSON.stringify(data)); };
  const saveSettings = (data: SystemSettings) => { setSettings(data); localStorage.setItem('nh_homes_db_v2_settings', JSON.stringify(data)); };

  const logActivity = (user: string, role: 'admin' | 'employee' | 'client', action: string, type: ActivityLog['type'], details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user,
      role,
      action,
      type,
      details
    };
    saveLogs([newLog, ...activityLogs]);
  };

  // Employee Actions
  const addEmployee = (empData: Omit<Employee, 'id' | 'employeeId'>) => {
    const nextIdNum = employees.length + 1;
    const employeeId = `EMP-${nextIdNum.toString().padStart(3, '0')}`;
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
      employeeId,
      status: 'Active'
    };
    saveEmployees([...employees, newEmp]);
  };

  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    const updated = employees.map(emp => emp.id === id ? { ...emp, ...updatedFields } : emp);
    saveEmployees(updated);
  };

  const deleteEmployee = (id: string) => {
    const filtered = employees.filter(emp => emp.id !== id);
    saveEmployees(filtered);
  };

  // Client Actions
  const addClient = (cltData: Omit<Client, 'id' | 'rentalHistory' | 'paymentHistory'>) => {
    const newClt: Client = {
      ...cltData,
      id: `clt-${Date.now()}`,
      rentalHistory: [],
      paymentHistory: []
    };
    saveClients([...clients, newClt]);
  };

  const updateClient = (id: string, updatedFields: Partial<Client>) => {
    const updated = clients.map(clt => clt.id === id ? { ...clt, ...updatedFields } : clt);
    saveClients(updated);
  };

  const deleteClient = (id: string) => {
    const filtered = clients.filter(clt => clt.id !== id);
    saveClients(filtered);
  };

  // Inventory Actions
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'equipmentId' | 'qrCode' | 'barcode' | 'maintenanceHistory' | 'rentalHistory'>) => {
    const categoryCode = itemData.category.substring(0, 3).toUpperCase();
    const nextIdNum = inventory.length + 1;
    const equipmentId = `EQ-${categoryCode}-${nextIdNum.toString().padStart(3, '0')}`;
    
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      equipmentId,
      qrCode: `QR_${equipmentId}_${Date.now()}`,
      barcode: `BAR_${equipmentId}_${Date.now()}`,
      maintenanceHistory: [],
      rentalHistory: []
    };
    saveInventory([...inventory, newItem]);
  };

  const updateInventoryItem = (id: string, updatedFields: Partial<InventoryItem>) => {
    const updated = inventory.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    saveInventory(updated);
  };

  const deleteInventoryItem = (id: string) => {
    const filtered = inventory.filter(item => item.id !== id);
    saveInventory(filtered);
  };

  // Rental Actions
  const submitRentalRequest = (reqData: Omit<RentalRequest, 'id' | 'rentalNumber' | 'invoiceNumber' | 'status' | 'createdAt' | 'amountPaid'>) => {
    const newRequest: RentalRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      rentalNumber: '',
      invoiceNumber: '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      amountPaid: 0
    };
    saveRentals([...rentalRequests, newRequest]);

    // Update equipment statuses to Reserved
    const equipmentIdsToReserve = reqData.items.map(i => i.equipmentId);
    const updatedInv = inventory.map(item => {
      if (equipmentIdsToReserve.includes(item.equipmentId)) {
        return { ...item, status: 'Reserved' as const };
      }
      return item;
    });
    saveInventory(updatedInv);
  };

  const approveRentalRequest = (
    id: string,
    additionalCharges: AdditionalCharges,
    discountTotal: number,
    gstTotal: number,
    grandTotal: number
  ) => {
    const year = new Date().getFullYear();
    const serial = rentalRequests.filter(r => r.rentalNumber).length + 1;
    const rentalNumber = `REN-${year}-${serial.toString().padStart(3, '0')}`;
    const invoiceNumber = `INV-${year}-${serial.toString().padStart(3, '0')}`;

    let clientToUpdate: { id: string; amount: number } | null = null;
    let equipmentToRent: string[] = [];

    const updatedRentals = rentalRequests.map(req => {
      if (req.id === id) {
        clientToUpdate = { id: req.clientId, amount: grandTotal };
        equipmentToRent = req.items.map(i => i.equipmentId);

        return {
          ...req,
          rentalNumber,
          invoiceNumber,
          additionalCharges,
          discountTotal,
          gstTotal,
          grandTotal,
          status: 'Approved' as const,
          approvedAt: new Date().toISOString(),
          invoiceDate: new Date().toISOString().split('T')[0]
        };
      }
      return req;
    });

    saveRentals(updatedRentals);

    // Update Equipment Status to Rented and update rental history
    if (equipmentToRent.length > 0) {
      const updatedInv = inventory.map(item => {
        if (equipmentToRent.includes(item.equipmentId)) {
          const clientName = updatedRentals.find(r => r.id === id)?.clientName || 'Client';
          const newHistory = {
            id: `rh-${Date.now()}`,
            rentalNumber,
            clientName,
            startDate: updatedRentals.find(r => r.id === id)?.startDate || '',
            endDate: updatedRentals.find(r => r.id === id)?.endDate || '',
            status: 'Active' as const
          };
          return {
            ...item,
            status: 'Rented' as const,
            rentalHistory: [newHistory, ...item.rentalHistory]
          };
        }
        return item;
      });
      saveInventory(updatedInv);
    }

    // Update Client Rental & Payment History
    if (clientToUpdate) {
      const targetRequest = updatedRentals.find(r => r.id === id)!;
      const updatedClients = clients.map(client => {
        if (client.id === clientToUpdate!.id) {
          const newRental = {
            rentalNumber,
            startDate: targetRequest.startDate,
            endDate: targetRequest.endDate,
            totalAmount: grandTotal,
            status: 'Active' as const
          };
          const newPayment = {
            invoiceNumber,
            date: new Date().toISOString().split('T')[0],
            amount: 0,
            method: 'Bank Transfer' as const,
            status: 'Pending' as const
          };
          return {
            ...client,
            rentalHistory: [newRental, ...client.rentalHistory],
            paymentHistory: [newPayment, ...client.paymentHistory]
          };
        }
        return client;
      });
      saveClients(updatedClients);
    }
  };

  const rejectRentalRequest = (id: string) => {
    let equipmentToRelease: string[] = [];

    const updatedRentals = rentalRequests.map(req => {
      if (req.id === id) {
        equipmentToRelease = req.items.map(i => i.equipmentId);
        return {
          ...req,
          status: 'Rejected' as const
        };
      }
      return req;
    });
    saveRentals(updatedRentals);

    // Release equipment back to Available
    if (equipmentToRelease.length > 0) {
      const updatedInv = inventory.map(item => {
        if (equipmentToRelease.includes(item.equipmentId)) {
          return { ...item, status: 'Available' as const };
        }
        return item;
      });
      saveInventory(updatedInv);
    }
  };

  const recordPayment = (
    id: string,
    amount: number,
    method: 'UPI' | 'Cash' | 'Cheque' | 'Bank Transfer'
  ) => {
    let clientId = '';
    let invoiceNo = '';
    let isFullyPaid = false;

    const updatedRentals = rentalRequests.map(req => {
      if (req.id === id) {
        clientId = req.clientId;
        invoiceNo = req.invoiceNumber;
        const newPaid = req.amountPaid + amount;
        isFullyPaid = newPaid >= req.grandTotal;
        return {
          ...req,
          amountPaid: newPaid,
          paymentMethod: method,
          paymentStatus: (isFullyPaid ? 'Completed' : (newPaid > 0 ? 'Partial' : 'Pending')) as any
        };
      }
      return req;
    });

    saveRentals(updatedRentals);

    // Update client payment history
    if (clientId && invoiceNo) {
      const updatedClients = clients.map(client => {
        if (client.id === clientId) {
          const updatedPayments = client.paymentHistory.map(pmt => {
            if (pmt.invoiceNumber === invoiceNo) {
              const newAmount = pmt.amount + amount;
              return {
                ...pmt,
                amount: newAmount,
                method,
                status: (isFullyPaid ? 'Completed' : 'Partial') as any
              };
            }
            return pmt;
          });
          return {
            ...client,
            paymentHistory: updatedPayments
          };
        }
        return client;
      });
      saveClients(updatedClients);
    }
  };

  const updateSettings = (updatedSettings: SystemSettings) => {
    saveSettings(updatedSettings);
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        clients,
        inventory,
        rentalRequests,
        activityLogs,
        settings,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addClient,
        updateClient,
        deleteClient,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        submitRentalRequest,
        approveRentalRequest,
        rejectRentalRequest,
        recordPayment,
        updateSettings,
        logActivity
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
