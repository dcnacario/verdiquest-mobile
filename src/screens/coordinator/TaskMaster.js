import React from 'react'
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import CardTask from '../../components/CardTask';

const TaskMaster = () => {
  return (
    <View style={styles.container}>
        <View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",
              marginBottom:10
            }}
          >
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.textStyle}>Tasks</Text>
            </View>
            <View style={{ alignSelf: "flex-end" }}>
              <Button title="+ Create" />
            </View>
          </View>
          <View>
          <ScrollView>
            <View>
              <CardTask
                title={"First"}
              />
            </View>
            <View>
              <CardTask
                title={"First"}
              />
            </View>
            <View>
              <CardTask
                title={"First"}
              />
            </View>
            <View>
              <CardTask
                title={"First"}
              />
            </View>
            <View>
              <CardTask
                title={"First"}
              />
            </View>
            <View>
              <CardTask
                title={"First"}
              />
            </View>
            <View>
              <CardTask
                title={"First"}
              />
            </View>
            <View>
              <CardTask
                title={"First"}
              />
            </View>
          </ScrollView>
          </View>
        </View>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 50,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      gap: 20,
    },
    textStyle: {
      fontSize: 18,
      paddingVertical: 10,
      fontWeight: "bold",
      textAlign: "center",
    }
  });

export default TaskMaster;