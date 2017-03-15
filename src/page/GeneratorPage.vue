<template>
  <el-row>

    <el-row>
      <h1>Bookmarks to Markdown Extension</h1>
    </el-row>

    <!-- 文件夹选择器 -->
    <el-row>
      <el-select v-model="folderSelector.selectedFolderName"
                 placeholder="Folder selection">
        <el-option
                v-for="item in folderSelector.options"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select>

      <el-button @click="onExportBtnClick"
                 type="primary">Export
      </el-button>
    </el-row>

    <el-row class="outputContainer">
      <el-col :span="2"
              :offset="5">
        <label>Output:</label>
      </el-col>

      <el-col :span="14">
        <el-input
                type="textarea"
                :rows="10"
                placeholder="请输入内容"
                v-model="markdownOutput">
        </el-input>
      </el-col>
    </el-row>
  </el-row>

</template>

<script src="./GeneratorPage.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .outputContainer {
    margin-top:20px
  }


</style>
