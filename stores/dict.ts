import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '@/utils/api'

export const useDictStore = defineStore('dict', { 
    state: () => ({
        dict: {},
        isLoaded: false // 避免重复请求
    }),
    actions: {
        async fetchDictMap () {
            try {
                const dictResult = await $fetch(API_ENDPOINTS.LIST_DICT, {
                    method: 'POST',
                    body: {}
                })
                console.log("获取字典成功:", dictResult);
                this.dict = dictResult.data;
            } catch (error) {
                console.log("获取字典失败")
            }
        }
    }

})