import axios from "axios";
import {createStore} from "vuex";
import axiosClient from "../axios";

const tmpSurveys = [
    {
        id: 100,
        title: "Survey with no sense.",
        slug: "no-sense-survey",
        status: "draft",
        image: "https://i.ibb.co/Pz2nyhc/rocket.jpg",
        description: "Super Survey without any sense. Enjoy!",
        created_at: "2022-02-10 10:06:35",
        updated_at: "2022-02-10 10:06:35",
        expire_date: "2022-02-20 10:06:35",
        questions: [
            {
                id: 1,
                type: "select",
                question: "What is your country?",
                description: null,
                data: {
                    options: [
                        {
                            uuid: "f8af96f2-1d80-4632-9e9e-b560670e52ea",
                            text: "USA"
                        },
                        {
                            uuid: "201c1ff5-23c9-42f9-bfb5-bbc850535440",
                            text: "France"
                        },
                        {
                            uuid: "b5c09733-a49e-460a-ba8a-526963010729",
                            text: "United Kingdom"
                        },
                        {
                            uuid: "2abf1cee-f5fb-427c-a220-b5d159ad6513",
                            text: "Germany"
                        },
                        {
                            uuid: "8d14341b-ec2b-4924-9aea-bda6a53b51fc",
                            text: "Poland"
                        },
                    ],
                },
            },
            {
                id: 2,
                type: "checkbox",
                question: "What is your favourite programming language?",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a dui auctor, rhoncus enim et, finibus leo. Proin posuere non nibh eget congue. Etiam tempor.",
                data: {
                    options: [
                        {
                            uuid: "f9af96f2-2d80-4632-7e9e-b560670e52ea",
                            text: "Java"
                        },
                        {
                            uuid: "291g1ff5-23c9-12f9-cfb5-bac850536443",
                            text: "PHP"
                        },
                        {
                            uuid: "f2vf06f2-1k81-4612-9e8e-p560070a52ev",
                            text: "JavaScript"
                        },
                        {
                            uuid: "d3ax96s1-8b61-5142-8c9e-d123670e52yo",
                            text: "Python"
                        },
                    ]
                }
            },
            {
                id: 3,
                type: "radio",
                question: "What kind of animal would you like to be?",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a dui auctor, rhoncus enim et, finibus leo. Proin posuere non nibh eget congue. Etiam tempor.",
                data: {
                    options: [
                        {
                            uuid: "s1bf86t3-5d43-2612-3e0a-n378691a01eae",
                            text: "Horse"
                        },
                        {
                            uuid: "101h3ff4-33a8-10j8-ldx3-cba950536443",
                            text: "Pig"
                        },
                        {
                            uuid: "c4nm96f2-3h82-5715-0m9z-q479903s52ev",
                            text: "Cow"
                        },
                        {
                            uuid: "l3mx06e1-7v41-1146-7b0a-s247998a02ea",
                            text: "Duck"
                        },
                    ]
                }
            },
            {
                id: 4,
                type: "text",
                question: "Are you vaccinated?",
                description: null,
                data: {},
            },
            {
                id: 5,
                type: "textarea",
                question: "What do you think about moon landing?",
                description: "Write your honest opinion. Nothing here is anonymous.",
                data: {},
            },
        ],
    },
];

const store = createStore({
    state: {
        user: {
            data: {},
            token: sessionStorage.getItem('TOKEN'),
        },
        currentSurvey: {
            loading: false,
            data: {}
        },
        surveys: [...tmpSurveys],
        questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
    },
    getters: {},
    actions: {
        getSurvey({commit}, id) {
            commit("setCurrentSurveyLoading", true);
            return axiosClient
                .get(`/survey/${id}`)
                .then((res) => {
                    commit("setCurrentSurvey", res.data);
                    commit("setCurrentSurveyLoading", false);
                    return res;
                })
                .catch((err) => {
                    commit("setCurrentSurveyLoading", false);
                    throw err;
                });
        },
        saveSurvey({ commit }, survey) {
            delete survey.image_url;
            let response;
            if (survey.id) {
                response = axiosClient
                    .put(`/survey/${survey.id}`, survey)
                    .then((res) => {
                        commit("setCurrentSurvey", res.data);
                        return res;
                    });
            } else {
                response = axiosClient.post("/survey", survey).then((res) => {
                    commit("setCurrentSurvey", res.data);
                    return res;
                });
            }
            return response;
        },
        deleteSurvey({}, id) {
            return axiosClient.delete(`/survey/${id}`);
        },
        register({commit}, user) {
        //     return fetch('http://localhost:8000/api/register', {
        //         headers: {
        //             "Content-Type": "application/json",
        //             Accept: "application/json",
        //         },
        //         method: "POST",
        //         body: JSON.stringify(user),
        //     }).then((res) => res.json())
        //       .then((res) => {
        //           commit("setUser", res);
        //           return res;
        //       });
            
            return axiosClient.post('/register', user)
                .then(({data}) => {
                    commit('setUser', data);
                    return data;
                })
        },
        login({commit}, user) {
            return axiosClient.post('/login', user)
                .then(({data}) => {
                    commit('setUser', data);
                    return data;
                })
        },
        logout({commit}) {
            return axiosClient.post('/logout')
                .then(response => {
                    commit('logout')
                    return response;
                })
        }
    },
    mutations: {
        setCurrentSurveyLoading: (state, loading) => {
            state.currentSurvey.loading = loading;
        },
        setCurrentSurvey: (state, survey) => {
            state.currentSurvey.data = survey.data;
        },
        
        logout: (state) => {
            state.user.token = null;
            state.user.data = {};
            sessionStorage.removeItem('TOKEN');
        },
        setUser: (state, userData) => {
            state.user.token = userData.token;
            state.user.data = userData.user;
            sessionStorage.setItem('TOKEN', userData.token);
        }
    },
    modules: {},
})

export default store;