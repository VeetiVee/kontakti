import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import * as Contacts from'expo-contacts';
import React, { useEffect, useState } from 'react';

const ContactView = ({firstName, lastName, phoneNumbers}) => {
  if (phoneNumbers && phoneNumbers[0]) {
    return (
      <View style={styles.contactView}>
        <Text>{firstName} </Text>
        <Text>{lastName} </Text>
        <Text>{phoneNumbers[0].number}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.contactView}>
        <Text>{firstName}</Text>
        <Text>{lastName}</Text>
      </View>
    );
  }
};

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [contacts, setContacts] = useState([]);
  

  useEffect(() => {
    (async () => {
      const {status} = await Contacts.requestPermissionsAsync();
      setHasPermission(status);
    })();
  }, []);

  const getContacts = async () => {
    if (hasPermission === 'granted') {
      const { data } = await Contacts.getContactsAsync();
      setContacts(data);
      console.log(data);
    }
  }

  const renderItem = ({item}) => (
    <ContactView
      firstName={item.firstName}
      lastName={item.lastName}
      phoneNumbers={item.phoneNumbers}
    />
  );

  return (
    <View style={styles.container}>
      {
        hasPermission ? (
          <View>
            <Text>
              {contacts.length ? (
               <FlatList
               data={contacts}
               renderItem={renderItem}
               keyExtractor={item => item.id}
             />
              ) : (
                  <Text>Didn't find any contacts</Text>
                )}
            </Text>
            
          </View>
        ) : (
            <Text>No permission to use Contacts</Text>
          )
      }
      <Button title="Get Contacts" onPress={() => getContacts()} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
