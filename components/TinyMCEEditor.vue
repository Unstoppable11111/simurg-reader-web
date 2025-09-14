<template>
  <div class="tinymce-editor">
    <Editor
      api-key="zb7kiha63mgz9olvrxsyo7x4v0bikbz9k5m1vl5mroj94c6z"
      v-model="content"
      :init="editorConfig"
      :disabled="disabled"
      @onInit="onInit"
      @onChange="onChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Editor from '@tinymce/tinymce-vue'

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  height: {
    type: [String, Number],
    default: 400
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'init', 'change'])

// 内容
const content = ref(props.modelValue)

// 编辑器配置
const editorConfig = {
  language: 'zh-Hans',
  height: props.height,
  placeholder: props.placeholder,
  menubar: false,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
  ],
  toolbar: [
    'undo redo | blocks | bold italic forecolor | alignleft aligncenter',
    'alignright alignjustify | bullist numlist outdent indent | removeformat | help'
  ],
  content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; }'
}

// 编辑器初始化事件
const onInit = (evt, editor) => {
  emit('init', editor)
}

// 内容变化事件
const onChange = (evt, editor) => {
  const content = editor.getContent()
  emit('update:modelValue', content)
  emit('change', content)
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  content.value = newValue
})

// 监听 content 变化
watch(content, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<style scoped>
.tinymce-editor {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}
</style>