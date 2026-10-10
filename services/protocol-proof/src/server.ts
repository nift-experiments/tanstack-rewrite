import {createStartHandler} from '@tanstack/react-start/server';export default {fetch:createStartHandler(()=>new Response('API boundary only',{status:404}))}
