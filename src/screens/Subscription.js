    import React from 'react';
    import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
    const Subscription = () => {
        // Function to handle the subscription option click
        const handleSubscriptionSelect = (type) => {
          console.log(`${type} subscription selected.`);
          // Add navigation or state update logic here
        };
      
        return (
            <View style={styles.container}>
        <Text style={styles.headerText}>Subscription</Text>
        
        <View style={styles.card}>
          <View style={styles.leftContainer}>
            <Image
              style={styles.avatar}
              source={require('../../assets/img/verdiquestlogo-ver2.png')} // Replace with your avatar image
            />
            <Text style={styles.name}>Ram P. De la Cruz</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Basic Subscription</Text>
            <Text style={styles.features}>
              *Limited Task Taking{'\n'}
              *Limited to 1 Event{'\n'}
              *Regular VerdiPoints Earning
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.card} onPress={() => handleSubscriptionSelect('Volunteer+')}>
          <View style={styles.leftContainer}>
            <Image
              style={styles.avatar1}
              source={require('../../assets/img/verdiquestlogo-ver2.png')} // Replace with your special avatar image
            />
            <Text style={styles.name1}>Ram P. De la Cruz</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Volunteer+ Subscriber</Text>
            <Text style={styles.features}>
              * Can take more Tasks and Difficulty{'\n'}
              * More Achievements{'\n'}
              * Join many events{'\n'}
              * Bonus VerdiPoints Earning{'\n'}
              * Subscriber Icon{'\n'}
              And More++{'\n'}
            </Text>
            <Text style={styles.price}>For Only ₱129/Mo.</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Avail Subscription</Text>
        </TouchableOpacity>
      </View>
    );
};


    const styles = StyleSheet.create({
     container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 16,
    width: '90%',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  leftContainer: {
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 16, // Adjust if needed
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 16, 
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  leftContainer1: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatar1: {
    marginBottom: 10,
    marginTop: 70,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name1: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 4,
  },
  features: {
    textAlign: 'left',
    marginBottom: 4,
  },
  price: {
    fontWeight: 'bold',
    color: 'green',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#34A853', // Green color
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

    export default Subscription;
