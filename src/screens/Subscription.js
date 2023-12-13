    import React from 'react';
    import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
    import { Path, Svg } from "react-native-svg";
    const Subscription = () => {
        // Function to handle the subscription option click
        const handleSubscriptionSelect = (type) => {
          console.log(`${type} subscription selected.`);
          // Add navigation or state update logic here
        };
      
        return (
          
          <View style={styles.container}>
          <Svg
            height={200}
            width={1440}
            viewBox="0 0 1440 320"
            style={styles.svgCurve}
          >
            <Path
              fill="#7B904B"
              d="M612.476 144.841L550.386 111.881C529.789 100.947 504.722 102.937 486.109 116.985L415.77 170.07C398.787 182.887 376.287 185.752 356.635 177.599L310.915 158.633C298.156 153.339 283.961 152.611 270.727 156.57L214.143 173.499C211.096 174.41 208.241 175.872 205.72 177.813C194.011 186.826 177.156 184.305 168.597 172.26L150.51 146.806C133.89 123.417 102.3 116.337 77.2875 130.397L0.635547 173.483L1.12709 99.8668C1.49588 44.6395 46.5654 0.167902 101.793 0.536689L681.203 4.40584C727.636 4.71591 765.026 42.6089 764.716 89.0422C764.538 115.693 743.66 137.608 717.049 139.075L612.476 144.841Z"
            />
          </Svg>
          
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
        <Svg
          height={200}
          width="1440"
          viewBox="0 0 1440 320"
          style={styles.bottomWavy}
        >
          <Path
            fill="#7B904B"
            d="M161.5 41.4474L219.626 76.2389C241.673 89.435 269.675 87.1283 289.265 70.5023L323.5 41.4474L357.823 16.6873C375.519 3.92172 398.75 1.76916 418.49 11.0659L462.12 31.6136C475.56 37.9434 490.87 39.0619 505.088 34.7525L556.393 19.2018C562.151 17.4565 567.521 14.6238 572.213 10.857C583.853 1.51223 599.233 -1.76023 613.669 2.03681L718.763 29.68C745.125 36.6142 763.5 60.4475 763.5 87.7063V135.5H544H69.9837C31.3327 135.5 0 104.167 0 65.5163C0 39.7769 22.9464 20.0957 48.3856 24.016L161.5 41.4474Z"
          />
        </Svg>
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
    marginTop: 20,
    bottom: 25,
 
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
    bottom: 10,
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
  svgCurve: {
    position: "absolute",
    top: -2,
    left: -316,
    zIndex: -1,
  },
  row: {
    flexDirection: "row",
    height: 0,
    justifyContent: "center",
    alignItems: "center",
    left: -30,
    position: "absolute",
    bottom: -25,
    zIndex: 1,
  },
  bottomWavy: {
    position: 'absolute',
    bottom: -115,
    left: -300,
    zIndex: -1,
  },
});

    export default Subscription;