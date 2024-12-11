import { Text, TouchableOpacity } from "react-native";

import { Styles } from "../styles/GlobalStyles";

interface ButtonProps {
    onPress: () => void;
    title: string;
    isBlue?: boolean;
    isGray?: boolean;
}

export default function Button({ title, onPress, isBlue, isGray }: ButtonProps) {
    return (
        <TouchableOpacity 
            style={
                isBlue 
                ? Styles.btnBlue 
                : isGray 
                ? Styles.btnGray 
                : Styles.btnLight // Default style if no theme logic
            } 
            onPress={onPress}>
            <Text 
               style={
                   isBlue || isGray 
                   ? Styles.smallTextLight 
                   : Styles.smallTextDark // Default text style if no theme logic
                }
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}
