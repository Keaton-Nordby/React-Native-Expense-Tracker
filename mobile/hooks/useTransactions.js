// using a custom hook (simple but was good practice for myself)

import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";



const API_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:5001/api'
    : 'http://localhost:5001/api'
  : 'https://react-native-expense-tracker.onrender.com/api';



export const useTranactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });
    const [isLoading, setIsLoading] = useState(true);


    // usecallback to better handle preformance -> memoize the function
    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`)
            const data = await response.json()
            setTransactions(data)
        } catch (error) {
            console.error("Error fetching transaction:", error)
        }
    }, [userId]);

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`)
            const data = await response.json()
            setSummary(data)
        } catch (error) {
            console.error("Error fetching summary:", error)
        }
    }, [userId])

    const loadData = useCallback(async () => {
  if (!userId) return;

  setIsLoading(true);
  try {
    await Promise.all([
      fetchTransactions().catch(e => console.error("Transactions error", e)),
      fetchSummary().catch(e => console.error("Summary error", e))
    ]);
  } catch (error) {
    console.error("Error loading data: ", error);
  } finally {
    setIsLoading(false);
  }
}, [fetchTransactions, fetchSummary, userId]);


    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE"});
            if(!response.ok) throw new Error("Failed to delete transaction");

            // this here is what refreshes the data
            loadData()
            Alert.alert("Success", "Transaction deleted successfully");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error", error.message);
        }
    };

    return { transactions, summary, isLoading, loadData, deleteTransaction };
};