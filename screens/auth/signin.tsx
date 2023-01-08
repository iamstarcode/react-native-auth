import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { Prompt, ResponseType } from 'expo-auth-session';
import * as SecureStorage from 'expo-secure-store'

//WebBrowser.maybeCompleteAuthSession();


import { Box, Center, FormControl, HStack, VStack, Text, Flex, Checkbox, Icon, View } from "native-base"
import { Formik } from "formik";
import * as Yup from 'yup';

import jwt_decode from "jwt-decode";

import MInput from "../../components/ui/Input";
import MButton from '../../components/ui/Button'

import { fontMedium, fontRegular } from "../../styles";
import { useAppDispatch } from "../../app/hooks";

import useAxios from '../../hooks/usesAxios'

import { AuthSate, setUser } from "../../app/features/auth/authSlice";

import GoogeIcon from '../../assets/img/googleicon.svg'
import { AntDesign } from '@expo/vector-icons';



import { ScreenProps } from "../../types";
import axios from "../../libs/axios";
import jwtDecode from "jwt-decode";
interface SignUpProps extends ScreenProps { }

export default function SignIn({ navigation }: SignUpProps) {

    const dispatch = useAppDispatch()
    const { publicAxios } = useAxios()
    const [show, setShow] = useState(false)
    const [facebokLoading, setFacebookLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '5838760336-4g7jjakirs229tem43id80tmhljfmqv5.apps.googleusercontent.com',
    })

    const [fbrequest, fbresponse, fbpromptAsync] = Facebook.useAuthRequest({
        androidClientId: '1076744036274531',
        responseType: ResponseType.Token,
        scopes: ['email', 'public_profile']
    })
    
    useEffect(() => {
        WebBrowser.warmUpAsync();

        return () => {
            WebBrowser.coolDownAsync();
        };
    }, [])

    useEffect(() => {
        const ok = async (token: any) => {
            //console.log(token)
             /* const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`,{
                 headers:{
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                 }
             })
            .then(res => res.data)
            .catch(e=>{
            }) */


            console.log(response) 
            const { sub, family_name, given_name, email }: any = jwtDecode(token)

            const data = {
                provider: 'google',
                id: sub,
                email,
                lastName: family_name,
                firstName: given_name,
                /*  email: "iamstarcode@gmail.com",
                 firstName: "Abiola",
                 id: "116190949505193780477",
                 lastName: "Bakare",
                 provider: "google", */
            }

           
            //handleSignInWithOAuth(data, setGoogleLoading)
            try {
                console.log('hjvgh',data)
                const response = await publicAxios.post('/auth/sign-in-with-oauth', {
                    ...data
                })
                if (response.status == 201) {
                    authenticate(response.data)
                   // setLoading(false)
                    setGoogleLoading(false)
                }
            } catch (error: any) {
                setGoogleLoading(false)
                console.log(error.response)
            }
        }

        if (response?.type === 'success') {
            if (response?.authentication) {
                ok(response?.authentication?.idToken)
            }
        }
        else if (response?.type === 'dismiss' || response?.type === 'error') {
            setGoogleLoading(false);
        }

    }, [response])

    useEffect(() => {
        const getUserDetails = async (token: string) => {
            const response = await axios.get(`https://graph.facebook.com/me?access_token=${token}`, {
                params: {
                    "fields": "id, email, name"
                }
            }).then(res => res.data)
            const { name, email, id } = response
            const names = name.split(' ')
            const data = {
                provider: 'facebook',
                id,
                email,
                lastName: names ? names[0] : '',
                firstName: names ? names[1] : '',
            }
            handleSignInWithOAuth(data, setFacebookLoading)
        }

        if (fbresponse?.type === 'success') {
            if (fbresponse.authentication) {
                getUserDetails(fbresponse?.authentication?.accessToken)
            }
        } else if (fbresponse?.type === 'dismiss' || fbresponse?.type === 'error') {
            setFacebookLoading(false);
        }

    }, [fbresponse])


    const handleSubmit = async (values: any, setSubmitting: any) => {
        try {
            const response = await publicAxios.post('/auth/sign-in', {
                email: values.email,
                password: values.password,
            })
            if (response.status == 201) {
                authenticate(response.data)
                setSubmitting(false)
            }
        } catch (error: any) {
            console.log(error)
            setSubmitting(false)
        }
    }

    const handleSignInWithOAuth = async (data: any, setLoading: any) => {

        console.log('hete')
        try {
            const response = await publicAxios.post('/auth/sign-in-with-oauth', {
                ...data
            })
            if (response.status == 201) {
                authenticate(response.data)
                setLoading(false)
            }
        } catch (error: any) {
            setLoading(false)
            console.log(error.response)
        }
    }

    const authenticate = async (data: any) => {
        const { user, refreshToken, accessToken } = data
        await SecureStorage.setItemAsync('refreshToken', refreshToken)
        const authSate: AuthSate = {
            user,
            accessToken,
            authenticated: true
        }
        dispatch(setUser(authSate))
    }
    return (
        <Box flex={1} px="3" >
            <Center mt="24">
                {/* <IconSignIn /> */}
                <Text style={{ ...fontRegular }} mt="8" mb="2" fontSize="2xl">Sign in to Awseome</Text>
            </Center>
            <Formik
                initialValues={{ email: '', password: '', rememberMe: false }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().required('email is required').email(),
                    password: Yup.string().required()
                })}
                onSubmit={async (values, { setSubmitting }) => await handleSubmit(values, setSubmitting)}
            >{({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isSubmitting }) => (
                <VStack space="5">
                    <FormControl isInvalid={errors.email ? true : undefined} >
                        <MInput autoComplete="email" value={values.email} onBlur={handleBlur('email')} onChangeText={handleChange('email')} placeholder="Email" />
                        <FormControl.ErrorMessage fontSize="xl">
                            {errors.email}
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.password ? true : undefined}>
                        <MInput
                            type={show ? "text" : "password"}
                            InputRightElement={<Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />}
                                size={5}
                                mr="2"
                                color="muted.400"
                                onPress={() => setShow(!show)} />}
                            value={values.password} onBlur={handleBlur('password')} onChangeText={handleChange('password')} placeholder="Password" />
                        <FormControl.ErrorMessage>
                            {errors.password}
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <HStack space={2} justifyContent="flex-end" >
                        <Text style={{ ...fontRegular }}>Remember Me</Text>
                        <Checkbox value={"true"} onChange={(e) => setFieldValue("rememberMe", e)} color="primary.400" _checked={{ color: "primary.400" }} accessibilityLabel="Remember me"></Checkbox>
                    </HStack>
                    <MButton isLoading={isSubmitting} isLoadingText="Signing In..." onPress={() => handleSubmit()}>
                        <Text style={{ ...fontMedium }} color="white" fontSize={18}>Sign In</Text>
                    </MButton>

                    <VStack space="2">
                        <MButton
                            bg="white"
                            color="primary.500"
                            leftIcon={<Icon as={GoogeIcon} />}
                            onPress={() => {
                                promptAsync();
                                setGoogleLoading(true);
                            }}
                            isLoading={googleLoading}
                            _loading={{
                                bg:'gray.400'
                            }}

                        >
                            <Text style={{ ...fontMedium }} color="primary.500" fontSize={18}>Sign In With Google</Text>
                        </MButton>
                        <MButton
                            bg="#1877f2"
                            leftIcon={<Icon as={AntDesign} name="facebook-square" size="lg" />}
                            onPress={() => {
                                fbpromptAsync();
                                setFacebookLoading(true)
                            }}
                            isLoading={facebokLoading}
                        >
                            <Text style={{ ...fontMedium }} color="white" fontSize={18}>Sign In With Facebook</Text>
                        </MButton>

                    </VStack>
                    <Flex direction="row" justifyContent="space-between">
                        <Text style={{ ...fontRegular }} color="primary.400" fontSize={14}>Forgot Password</Text>
                        <Text onPress={() => navigation.navigate("SignUp")} style={{ ...fontRegular }} color="primary.400" fontSize={14}>Create account</Text>
                    </Flex>
                </VStack>
            )}
            </Formik>
        </Box>
    );
}
