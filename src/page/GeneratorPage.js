/**
 * Created by simon on 2017/3/16.
 */

export default {
  name: 'GeneratorPage',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      markdownOutput: 'this is text area',

      folderSelector: {
        options: [
          {
            value: '选项1',
            label: '黄金糕'
          },
          {
            value: '选项2',
            label: '双皮奶'
          },
          {
            value: '选项3',
            label: '蚵仔煎'
          },
          {
            value: '选项4',
            label: '龙须面'
          },
          {
            value: '选项5',
            label: '北京烤鸭'
          }
        ],
        selectedFolderName: ''
      },
    }
  },

  methods: {
    onExportBtnClick(){
      alert('onExportBtnClick')
    }
  }
}
