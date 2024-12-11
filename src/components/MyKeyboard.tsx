// IM_2021_108 SMR Gunawardhane

import * as React from "react"; // Import the React library for building components
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native"; // Import essential React Native components for UI building

import Button from "./Button"; // Import the custom Button component
import { Styles } from "../styles/GlobalStyles"; // Import global styles
import { myColors } from "../styles/Colors"; //Import color definitions

// Main component of the calculator
export default function MyKeyboard() {
    // State variables for managing calculator behavior
    const [currentInput, setCurrentInput] = React.useState("");
    const [calculationString, setCalculationString] = React.useState("");
    const [result, setResult] = React.useState<number | null>(null);
    const [lastOperator, setLastOperator] = React.useState<string | null>(null);
    const [awaitingSecondNumber, setAwaitingSecondNumber] = React.useState(false);
    const [isResultDisplayed, setIsResultDisplayed] = React.useState(false);
    const [historyVisible, setHistoryVisible] = React.useState(false);
    const [history, setHistory] = React.useState<
        { calculation: string; result: number }[]
    >([]);

     // Function that performs arithmetic operations
    const performOperation = (a: number, b: number, operation: string): number | string => { //output either number or string
        switch (operation) {
            case "+":
                return a + b;
            case "-":
                return a - b;
            case "*":
                return a * b;
            case "/":
                return b === 0 ? "Cannot divide by zero" : a / b;
            case "%":
                return a * (b / 100);
            default:
                return b; // Default case, returns the second operand
        }
    };
    

    // Handler for when a number button is pressed
    const handleNumberPress = (buttonValue: string) => {
        if (isResultDisplayed) {
            // If a result is displayed, reset input
            setCurrentInput(buttonValue);
            setCalculationString("");
            setResult(null);
            setLastOperator(null);
            setAwaitingSecondNumber(false);
            setIsResultDisplayed(false);
        } else if (awaitingSecondNumber) {
            // If waiting for second number, set the current input as the second number
            setCurrentInput(buttonValue);
            setAwaitingSecondNumber(false);
            setCalculationString((prev) => `${prev} ${buttonValue}`);
        } else {
            // Check if the input is a decimal point and validate
            if (buttonValue === ".") {
                // Prevent adding multiple decimal points
                if (currentInput.includes(".")) return; // Prevent multiple decimal points
            }
    
            const newInput = currentInput + buttonValue;
            setCurrentInput(newInput);
            setCalculationString((prev) => `${prev}${buttonValue}`);
        }
    };
    
    const handleOperationPress = (operation: string) => {
        // Prevent action if the input is empty and there's no result and prevent using operator first
        if (currentInput === "" && result === null) return;
    
        const currentNumber = currentInput === "" ? result! : parseFloat(currentInput);
    
        // Handle the percentage operation
        if (operation === "%") {
            if (currentInput) {
                const percentageValue = parseFloat(currentInput) / 100;
                setCurrentInput(percentageValue.toString());
                setCalculationString(`${currentInput} %`);
                setIsResultDisplayed(true);
                setResult(percentageValue);
            }
            return;
        }
    
        // Prevent multiple consecutive operators like +++ or ---
        if (isResultDisplayed && ["+", "-", "*", "/"].includes(operation)) {
            // If the last operator is the same, return early
            if (lastOperator === operation) return;
        }
    
        // If result is displayed, continue with new operation
        if (isResultDisplayed) {
            setCalculationString(`${currentNumber} ${operation}`);
            setLastOperator(operation);
            setCurrentInput("");
            setIsResultDisplayed(false);
            setAwaitingSecondNumber(true);
        } else if (result !== null && awaitingSecondNumber === false) {
            // Perform operation if the second number is awaited
            const newResult = performOperation(result, currentNumber, lastOperator!);
            setResult(newResult);
            setCalculationString((prev) => `${prev} ${operation}`);
            setAwaitingSecondNumber(true);
        } else if (result === null) {
            // Set the first result if not present
            setResult(currentNumber);
            setAwaitingSecondNumber(true);
            setCalculationString((prev) => `${prev} ${operation}`);
        }
    
        // Update the last operator and reset the current input
        setLastOperator(operation);
        setCurrentInput("");
    };
    

    // Handler to get the result of the calculation
    const getResult = () => {
    if (currentInput === "" || lastOperator === null) return;// If no input or no operator, return

    const currentNumber = parseFloat(currentInput);
    const finalResult = performOperation(result!, currentNumber, lastOperator);

    if (typeof finalResult === "string") {
        // If an error occurs (e.g., division by zero), display the error message
        setCurrentInput(finalResult);
        setCalculationString("");
        setIsResultDisplayed(true);
    } else {
        setResult(finalResult);// Set the final result
        setIsResultDisplayed(true);
        setHistory([
            ...history,
            { calculation: calculationString + " =", result: finalResult },
        ]);
        setCalculationString("");
        setCurrentInput(finalResult.toString());
        setLastOperator(null);
        setAwaitingSecondNumber(false);
    }
};


// Function to clear the calculator    
const clear = () => {
        setCurrentInput("");
        setCalculationString("");
        setResult(null);
        setLastOperator(null);
        setAwaitingSecondNumber(false);
        setIsResultDisplayed(false);
    };

    // Function to clear the calculation history
    const clearHistory = () => setHistory([]);

    // Function to handle backspace (deleting the last digit)
    const removeHistoryItem = (index: number) => {
        const newHistory = [...history];
        newHistory.splice(index, 1);
        setHistory(newHistory);
    };

    const handleBackspace = () => {
        setCurrentInput(currentInput.slice(0, -1));
        setCalculationString(calculationString.slice(0, -1));
    };

    // Function to handle square root operation, math library is used
    const handleSquareRoot = () => {
        if (currentInput === "") return;
        const number = parseFloat(currentInput);
        if (number < 0) {
            setCurrentInput("Error");
            setIsResultDisplayed(true);
            return;
        }
        const squareRoot = Math.sqrt(number);
        setCurrentInput(squareRoot.toString());
        setIsResultDisplayed(true);
        setCalculationString("");
    };

    const handleHistoryItemClick = (calculation: string, result: number) => {
        setCurrentInput(result.toString());
        setCalculationString(calculation);
        setResult(result);
        setIsResultDisplayed(true);
        setHistoryVisible(false);
    };

    // Function to dynamically adjust the font size based on the length of the current input
    const getFontSize = () => (currentInput.length > 8 ? 40 : 50);
    const getFontSizei = () => (calculationString.length > 8 ? 30 : 40);
    
    //cal UI
    return (
        <View style={Styles.viewBottom}>
            {!historyVisible ? (
                <>
                    <View style={styles.header}>
                        <Text style={styles.title}>My Calculator</Text>
                        <TouchableOpacity onPress={() => setHistoryVisible(true)}>
                            <Text style={styles.historyButton}>⏳</Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            height: 120,
                            width: "90%",
                            justifyContent: "flex-end",
                            alignSelf: "center",
                        }}
                    >
                        <Text style={[Styles.screenSecondNumber,{ color: myColors.gray, fontSize: getFontSizei() }]}>
                            {isResultDisplayed ? "" : calculationString}
                        </Text>
                        <Text
                            style={[
                                Styles.screenFirstNumber,
                                { color: myColors.result, fontSize: getFontSize() },
                            ]}
                        >
                            {currentInput || result || "0"}
                        </Text>
                    </View>
                    <View style={Styles.row}>
                        <Button title="C" isGray onPress={clear} />
                        <Button title="⌫" isGray onPress={handleBackspace} />
                        <Button title="%" isBlue onPress={() => handleOperationPress("%")} />
                        <Button title="÷" isBlue onPress={() => handleOperationPress("/")} />
                    </View>
                    <View style={Styles.row}>
                        <Button title="7" onPress={() => handleNumberPress("7")} />
                        <Button title="8" onPress={() => handleNumberPress("8")} />
                        <Button title="9" onPress={() => handleNumberPress("9")} />
                        <Button title="×" isBlue onPress={() => handleOperationPress("*")} />
                    </View>
                    <View style={Styles.row}>
                        <Button title="4" onPress={() => handleNumberPress("4")} />
                        <Button title="5" onPress={() => handleNumberPress("5")} />
                        <Button title="6" onPress={() => handleNumberPress("6")} />
                        <Button title="-" isBlue onPress={() => handleOperationPress("-")} />
                    </View>
                    <View style={Styles.row}>
                        <Button title="1" onPress={() => handleNumberPress("1")} />
                        <Button title="2" onPress={() => handleNumberPress("2")} />
                        <Button title="3" onPress={() => handleNumberPress("3")} />
                        <Button title="+" isBlue onPress={() => handleOperationPress("+")} />
                    </View>
                    <View style={Styles.row}>
                        <Button title="√" onPress={handleSquareRoot} />
                        <Button title="0" onPress={() => handleNumberPress("0")} />
                        <Button title="." onPress={() => handleNumberPress(".")} />
                        <Button title="=" isBlue onPress={getResult} />
                    </View>
                </>
            ) : (//history UI
                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>History</Text>
                    <ScrollView>
                        {history.length > 0 ? (
                            history.map((item, index) => (
                                <View key={index} style={styles.historyItemContainer}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleHistoryItemClick(item.calculation, item.result)
                                        }
                                    >
                                        <Text style={styles.historyItem}>
                                            {item.calculation} {item.result}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => removeHistoryItem(index)}>
                                        <Text style={styles.deleteButton}>❌</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noHistory}>No history available</Text>
                        )}
                    </ScrollView>
                    <View style={styles.historyActions}>
                        <TouchableOpacity onPress={() => setHistoryVisible(false)}>
                            <Text style={styles.actionButton}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={clearHistory}>
                            <Text style={styles.actionButton}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

//calculator history
const styles = StyleSheet.create({
    title: { 
        fontSize: 24,
        fontWeight: "bold",
        color: myColors.result,
        marginBottom:80
    },
    
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
        marginHorizontal: 20,
    },
    
    historyButton: {
        fontSize: 24,
        marginBottom:70
    },
    
    historyContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20,  
        marginBottom: 500, 
        width:300
    },
    
    historyTitle: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,  
    },
    
    historyItem: {
        fontSize: 18,
        color: myColors.result,
        marginBottom: 10,
    },
    
    deleteButton: {
        fontSize: 14,
        color: "red",
    },
    
    historyItemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 100, 
    },
    
    noHistory: {
        textAlign: "center",
        color: "gray",
        marginBottom: 60,  
    },
    
    historyActions: {
        position: "absolute", 
        bottom: 20,            
        left: 0,              
        right: 0,             
        flexDirection: "row",
        justifyContent: "space-between",  
        paddingHorizontal: 20,  
        paddingVertical: 10,
        marginBottom: -500,
           
    },
    
    actionButton: {
        fontSize: 16,          
        color: myColors.black,
        paddingHorizontal: 10, 
        paddingVertical: 5, 
          
    },
        
});




