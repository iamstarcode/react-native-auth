import { Button, Text } from "native-base";
import { IButtonProps, InterfaceButtonProps, } from "native-base/lib/typescript/components/primitives/Button/types";


export default function MButton(props: IButtonProps) {

    return <Button size="lg"
        bg="primary.400" p="4"
        
        {...props}>
    </Button>
}