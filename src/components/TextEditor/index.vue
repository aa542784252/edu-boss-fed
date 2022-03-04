<template>
 <div class="text-editor" ref='editor'></div>
</template>

<script>
import { uploadCourseImage } from '@/services/course'
import E from 'wangeditor'

export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      editor: null,
      loaded: false
    }
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor)
      editor.config.onchange = val => {
        this.$emit('input', val)
      }
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        if (data.code === '000000') {
          insertImgFn(data.data.name)
        }
      }
      editor.create()
      editor.txt.html(this.value)
      this.editor = editor
    }
  },
  mounted () {
    this.initEditor()
  },
  watch: {
    value () {
      if (this.loaded === false) {
        this.editor.txt.html(this.value)
        this.loaded = true
      }
    }
  }
}
</script>

<style scoped lang=""></style>
