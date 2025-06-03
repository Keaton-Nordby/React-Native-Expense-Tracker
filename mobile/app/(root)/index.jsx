import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, router, useRouter } from 'expo-router'
import { Text, View, Image, TouchableOpacity, FlatList, Alert } from 'react-native'
import { SignOutButton } from '../../components/SignOutButton'
import { useTranactions } from '../../hooks/useTransactions';
import { useEffect } from 'react';
import PageLoader from '../../components/PageLoader';
import { styles } from '../../assets/styles/home.styles';
import { Ionicons } from "@expo/vector-icons" 
import { BalanceCard } from '../../components/BalanceCard';
import { TransactionItem } from '../../components/TransactionItem';




export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  const {transactions, summary, isLoading, loadData, deleteTransaction} = useTranactions(user.id)

  useEffect(() => {
    loadData()
  }, [loadData]);

  const handleDelete = (id) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ]);
  };


  if(isLoading) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={require("../../assets/images/logo.png")}
            style={styles.headerLogo}
            resizeMode='contain'
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome, </Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color="#FFF"/>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <BalanceCard summary={summary} />
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList 
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({item}) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
      />

    </View>



  )
}