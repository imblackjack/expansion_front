<template>





	<el-form ref="form" :model="form" label-width="90px">

		<el-form-item label="初始化类型">
			<el-checkbox-group v-model="form.checkList">
				<el-checkbox label="SSH免密"></el-checkbox>
				<el-checkbox label="JDK1.8"></el-checkbox>
				<el-checkbox label="PHP"></el-checkbox>
				<!-- <el-checkbox label="禁用" disabled></el-checkbox> -->
			</el-checkbox-group>
		</el-form-item>

		<!-- <el-form-item label="选择">
			<el-select v-model="form.region" placeholder="请选择">
				<el-option label="区域一" value="shanghai"></el-option>
				<el-option label="区域二" value="beijing"></el-option>
			</el-select>
		</el-form-item> -->

		<el-form-item label="初始化IP">
			<el-input type="textarea" v-model="form.desc" placeholder="每行一个IP" :rows="30" resize="vertical"></el-input>
		</el-form-item>

		<el-form-item>
			<el-button type="primary" @click="onSubmit()">执行</el-button>
			<el-button>取消</el-button>
		</el-form-item>

	</el-form>




</template>

<script>
	import * as API from "../api/v1";
	
	export default {
		data() {
			return {
				form: {
					// region: '',
					desc: '',
					checkList: [],
				},
				
				sourceForm: {
					source: ''
				}
				
				
			}
		},

		methods: {

			runCommand(sourceForm) {

				API.runCommand(sourceForm)
					.then(res => {

						return this.$notify.success({
							// title: '',
							message: ' ' + ' 初始化成功 !',
							duration: 10000,
						})
					}).catch(error => {
						// return this.$message.error("下载失败!")
						return this.$notify.error({
							message: ' ' + ' 初始化失败 !',
							duration: 0,
						})
					})
			},

			onSubmit() {
				console.log(this.form)
				
				let source = this.form.desc
				this.sourceForm.source = source
				
				this.runCommand(this.sourceForm)
			}
			
		}
	}
</script>
