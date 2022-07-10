import { Formik, Form } from "formik";
import { Box, Center, Button, VStack, FormControl, Text , Icon} from "native-base"

import * as SecureStorage from 'expo-secure-store'

import * as Yup from 'yup'


//import IconSignUp from '../../assets/img/signupicon.svg'
import { ScreenProps } from "../../types";
import MInput from "../../components/ui/Input";
import MButton from "../../components/ui/Button";

import { fontMedium, fontRegular } from '../../styles/index'
import axios from "../../libs/axios";
import { useState } from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { useAppDispatch } from "../../app/hooks";

import {AuthSate, setUser} from '../../app/features/auth/authSlice'

interface SingUpProps extends ScreenProps {}

export default function SingUp({ route, navigation }: SingUpProps) {

    const [show, setShow] = useState(false);
    const dispatch = useAppDispatch()

    const handleSubmit = async (values: any, setSubmitting: any) => {
        try {
            const response = await axios.post('/auth/sign-up', {
                email: values.email,
                password: values.password,
            })

            if (response.status == 201) {
                const { user, refreshToken, accessToken } = response.data
                await SecureStorage.setItemAsync('refreshToken', refreshToken)
                const authSate: AuthSate = {
                    user,
                    accessToken,
                    authenticated: true
                }
                dispatch(setUser(authSate))
                setSubmitting(false)
            }
        } catch (error) {

        }

    }

    //  const {test} = route.params
    return (
        <Box flex="1" px="3">
            <Center>
                {/* <IconSignUp /> */}
                <Text style={{ ...fontRegular }} mt="16" mb="2" fontSize="2xl">Register to Awesome</Text>
            </Center>

            <Formik initialValues={{
                email: "",
                password: ""
            }}
                validationSchema={Yup.object({
                    email: Yup.string().required().email(),
                    password: Yup.string().required()
                })}
                onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}>
                {({ handleChange, handleSubmit,  handleBlur, values, errors, isSubmitting }) => (
                    <VStack space="5">
                        <FormControl isInvalid={errors.email ? true : undefined} >
                            <MInput autoComplete="email" value={values.email} onBlur={handleBlur('email')} onChangeText={handleChange('email')} placeholder="Email" />
                            <FormControl.ErrorMessage fontSize="xl">
                                {errors.email}
                            </FormControl.ErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.password ? true : undefined} >
                        <MInput
                            type={show ? "text" : "password"}
                            InputRightElement={<Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />}
                                size={5}
                                mr="2"
                                color="muted.400"
                                onPress={() => setShow(!show)} />}
                            value={values.password} onBlur={handleBlur('password')} onChangeText={handleChange('password')} placeholder="Password" />
                        </FormControl>

                        <MButton isLoading={isSubmitting} isLoadingText="Signing up..." onPress={() => handleSubmit()}>
                            <Text style={{ ...fontMedium }} color="white" fontSize={18}>Create Account</Text>
                        </MButton>
                        <Center> <Text
                            style={{ ...fontRegular }}
                            color="coolGray.900"
                            fontSize={14}>
                            Alraedy have an account?, 
                            <Text
                            onPress={()=>navigation.navigate('SignIn')}
                            style={{ ...fontRegular }}
                            color="primary.400"
                            fontSize={14}>
                            {' '}Sign In
                        </Text>
                        </Text>
                        </Center>
                    </VStack>
                )}
            </Formik>
        </Box>
    );
}
