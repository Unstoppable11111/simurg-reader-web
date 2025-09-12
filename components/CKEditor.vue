<template>
  <div>
    <div ref="editorElement"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editorElement = ref()
let editorInstance = null

onMounted(async () => {
  try {
    // 动态导入 CKEditor
    const { default: DecoupledEditor } = await import('@ckeditor/ckeditor5-build-decoupled-document')
    
    // 创建编辑器实例
    editorInstance = await DecoupledEditor.create(editorElement.value, {
      language: 'zh-cn',
      placeholder: '请输入内容...'
    })
    
    // 设置初始值
    editorInstance.setData(props.modelValue)
    
    // 监听数据变化
    editorInstance.model.document.on('change:data', () => {
      emit('update:modelValue', editorInstance.getData())
    })
    
    // 将工具栏添加到容器中
    if (editorElement.value.parentElement) {
      editorElement.value.parentElement.insertBefore(
        editorInstance.ui.view.toolbar.element,
        editorElement.value
      )
    }
  } catch (error) {
    console.error('CKEditor 初始化失败:', error)
  }
})

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.destroy()
      .catch(error => {
        console.error('CKEditor 销毁失败:', error)
      })
  }
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (editorInstance && newValue !== editorInstance.getData()) {
    editorInstance.setData(newValue || '')
  }
})
</script>

<style scoped>
:deep(.ck-toolbar) {
  border-radius: 4px 4px 0 0;
}

:deep(.ck-content) {
  min-height: 300px;
  padding: 1rem;
  border-radius: 0 0 4px 4px;
}
</style>