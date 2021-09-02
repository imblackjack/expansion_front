<template>
	<div id="Project">
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>应用管理</el-breadcrumb-item>
			<el-breadcrumb-item>应用编辑</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片区域 -->
		<el-card class="box-card">

			<!-- 搜索与添加区域 -->
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input v-model="queryInfo.search" clearable placeholder="请输入内容">
						<el-button slot="append" icon="el-icon-search" @click="getData()" />
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible=true">添加应用
					</el-button>
				</el-col>
			</el-row>

			<!-- 应用列表区域 -->
			<el-table :data="tableData" border highlight-current-row :default-sort="{prop:'id', order:'descending'}" size="small">
				<el-table-column type="index" />
				<el-table-column prop="id" v-if="false"/>
				<el-table-column label="应用名" prop="app_name" width="180px"/>
				<el-table-column label="部署ip" prop="ip" show-overflow-tooltip width="100px"/>
				<el-table-column label="源服务器IP" prop="source" width="100px"/>
				<el-table-column label="源ssh_port" prop="s_port" width="100px"/>
				<el-table-column label="源代码path" prop="s_code"/>
				
				<el-table-column label="同步源代码" align="center" width="100px">
					<template slot-scope="scope">
						<el-button @click="download(scope.row.id,scope.row.source,scope.row.s_port,scope.row.s_code,scope.row.code_status,scope.row.app_name)" type="primary" size="small">下载<i
							 class="el-icon-download el-icon--right"></i></el-button>
					</template>
				</el-table-column>
				
				<el-table-column label="同步状态" align="center" width="80px">
					<template slot-scope="scope">
						<el-progress :width="30" type="circle" :percentage="scope.row.code_status" :stroke-width="5" :color="color"
						:format="format"></el-progress>
					</template>
				</el-table-column>
				
				<el-table-column label="状态" prop="status" align="center" width="80px">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.app_status" />
					</template>
				</el-table-column>

				<el-table-column label="操作" width="130px">
					<template slot-scope="scope">
						<el-button icon="el-icon-edit" size="mini" type="primary" @click="show(scope.row.id)" />
						<el-button icon="el-icon-delete" size="mini" type="danger" @click="remove(scope.row.id)" />
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页区域 -->
			<!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.page"
			 :page-sizes="[15, 30, 50, 100]" :page-size="queryInfo.page_size" layout="total, sizes, prev, pager, next, jumper"
			 :total=total>
			</el-pagination> -->

		</el-card>


		<el-dialog :visible.sync="addDialogVisible" title="添加应用" width="30%">
			<!-- 内容主体区域 -->
			<el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
				<el-form-item label="应用名" prop="app_name">
					<el-input v-model="addForm.app_name" placeholder="英文名称" />
				</el-form-item>
				<el-form-item label="部署IP" prop="ip">
					<el-input v-model="addForm.ip" placeholder="每行一个IP" :rows="10" type="textarea" />
				</el-form-item>
				<el-form-item label="源服务器IP" prop="source">
					<el-input v-model="addForm.source" />
				</el-form-item>
				<el-form-item label="源ssh_port" prop="s_port">
					<el-input v-model="addForm.s_port" />
				</el-form-item>
				<el-form-item label="源代码path" prop="s_code">
					<el-input v-model="addForm.s_code" />
				</el-form-item>

			</el-form>

			<!-- 底部区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogClosed()">取 消</el-button>
				<el-button type="primary" @click="add()">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 修改应用对话框 -->
		<el-dialog :visible.sync="editDialogVisible" title="修改应用" width="30%" @close="editDialogClosed">
			<el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
				<el-form-item label="应用名">
					<el-input v-model="editForm.app_name" disabled />
				</el-form-item>
				<el-form-item label="dtree_id">
					<el-input v-model="editForm.did" />
				</el-form-item>
				<el-form-item label="源服务器">
					<el-input v-model="editForm.source" />
				</el-form-item>
				<el-form-item label="部署IP">
					<el-input v-model="editForm.ip" rows="10" type="textarea" />
				</el-form-item>
				<el-form-item label="源服务器IP" prop="source">
					<el-input v-model="editForm.source" />
				</el-form-item>
				<el-form-item label="源ssh_port" prop="s_port">
					<el-input v-model="editForm.s_port" />
				</el-form-item>
				<el-form-item label="源代码path" prop="s_code">
					<el-input v-model="editForm.s_code" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editInfo">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	import * as API from "../api/v1";

	export default {
		name: "Project",
		data() {
			return {
				// show: false,
				tableData: [],

				// 控制添加应用对话框的显示与隐藏
				addDialogVisible: false,
				// 添加应用的表单数据
				addForm: {
					// id: 0,
					app_name: '',
					source: '',
					ip: '',
					// dtree_info: '',
					paas_name: '',
					status: true,
					s_port: 22,
					s_code: ''
				},
				// 添加表单的验证规则对象
				// 校验空行
				addFormRules: {
					app_name: [{
							required: true,
							message: "请输入应用名称",
							tragger: 'blur'
						},
						{
							min: 3,
							max: 25,
							message: '应用名称的长度在3到25个字符之间',
							trigger: 'blur'
						}
					],
					did: [{
							required: true,
							message: "请输入应用名称",
							tragger: 'blur'
						},
						{
							mini: 4,
							max: 4,
							message: '',
							trigger: 'blur'
						}
					],
					source: [{
							required: false,
							message: "请输入IP地址",
							tragger: 'blur'
						},
						{
							min: 3,
							max: 15,
							message: '至少输入一个ip地址',
							trigger: 'blur'
						}
					],
					ip: [{
							required: true,
							message: "请输入IP地址",
							tragger: 'blur'
						},
						{
							min: 7,
							message: "至少输入一个ip地址",
							trigger: 'blur'
						}
					]
				},

				// 控制修改对话框的显示与隐藏
				editDialogVisible: false,

				// 查询到的用户信息对象
				editForm: {
					id: 0,
					app_name: '',
					did: 0,
					ip: '',
					source: '',
					s_port: 0,
					s_code: '',
				},

				// 修改表单的验证规则对象
				editFormRules: {
					app_name: [{
							required: true,
							message: '请输入任务名称',
							tragger: 'blur'
						},
						{
							min: 3,
							max: 15,
							message: '任务名称的长度在3到10个字符之间',
							trigger: 'blur'
						}
					],
					ip: [{
							required: true,
							message: '请输入IP地址',
							tragger: 'blur'
						},
						{
							min: 7,
							message: '存在空行',
							trigger: 'blur',
							pattern: '[^ \x22]+'
						}
					]
				},

				// 分页
				total: 0,
				queryInfo: {
					search: '',
					// 当前的页数
					page: 1,
					// 当前每页显示多少条
					page_size: 10,
					// 排序
					ordering: '-id'
				},

				// download_percentage: 0,
				// download_color: '',
				// code_status: 0,
				
				downloadForm: {
					id: 0,
					source: '',
					s_port: 0,
					s_code: '',
				},
				
			};
		},

		mounted() {
			this.getData();
		},

		methods: {

			// 获取应用列表
			// getData: function getData() {
			// 	API.getAppInfo(this.dtreeInfo)
			// 		.then(res => {
			// 			// this.tableData = res.results;
			// 			this.tableData.app_name = res.info.name
			// 			console.log(res.info.name)
			// 		})
			// },

			getData: function getData() {
				API.getApps(this.queryInfo)
					.then(res => {
						this.tableData = res.results;
						this.total = res.count;
						console.log(res)
					})

			},


			// 监听添加用户对话框的关闭事件
			addDialogClosed() {
				this.addDialogVisible = false;
				// console.log(this.$refs.addFormRef.resetFields())
				this.$refs['addFormRef'].resetFields();
			},

			// 点击添加确定按钮
			add: function addData() {
				console.log(this.$refs.addFormRef.validate);
				this.$refs.addFormRef.validate(valid => {
					// const valid = true
					if (!valid) return;

					API.postApp(this.addForm)
						.then(res => {
							this.addDialogVisible = false;
							this.getData();
							this.$refs['addFormRef'].resetFields();
							return this.$message.success("创建成功！")
						}).catch(error => {
							return this.$message.error("创建失败! 请检查输入的数据!")
						})
				})
			},

			// 根据id删除
			remove: function removeAppById(id) {
				console.log(id)
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						API.deleteApp(id)
							.then(res => {
								console.log(res)
								if (res.status !== 204) {
									// console.log(res)
									return this.$message.error('删除失败 ！');
								}
								this.$message.success('删除成功 ！');
								this.getData();
							});
					})
			},

			show: function showEditDialog(id) {
				API.getApp(id + '/', {})
					.then(res => {
						if (res.status !== 200) {
							return this.$message.error('查询失败 ！');
						}
						this.editForm = res.data;
					});
				this.editDialogVisible = true;
			},

			// 监听修改对话框的关闭
			editDialogClosed() {
				this.$refs.editFormRef.resetFields();
			},

			
			// 修改验证
			editInfo: function editInfo() {
				// console.log(this.$refs.editFormRef.validate)
				this.$refs.editFormRef.validate(valid => {
					if (!valid) return;

					API.putApp(this.editForm.id, {
							app_name: this.editForm.app_name,
							did: this.editForm.did,
							source: this.editForm.source,
							ip: this.editForm.ip,
							s_port: this.editForm.s_port,
							s_code: this.editForm.s_code
						})
						.then(res => {
							if (res.status !== 200) {
								return this.$message.error('修改失败 ！');
							}
							// 关闭对话框
							this.editDialogVisible = false;
							// 刷新列表
							this.getData();
							// 提示修改成功
							this.$message.success('修改成功 ！');
						});
				});
			},
			
			// 自定义函数，执行下载动作
			step: function step(downloadForm,app_name) {
			
				API.downloadCode(downloadForm)
					.then(res => {
			
						API.putCodeStatus(downloadForm.id, {
							code_status: 100
						})
						// this.getData();
						return this.$notify.success({
							// title: '',
							message: ' ' + app_name + ' 下载成功 !',
							duration: 10000,
						})
					}).catch(error => {
						// return this.$message.error("下载失败!")
						return this.$notify.error({
							message: ' ' + app_name + ' 下载失败 !',
							duration: 0,
						})
					})
			},

			download: function downloadCode(id, source, s_port, s_code, code_status, app_name) {			
				
				this.downloadForm.id = id
				this.downloadForm.source = source
				this.downloadForm.s_port = s_port
				this.downloadForm.s_code = s_code
				
				// console.log(this.downloadForm)
				console.log(app_name)

				if (code_status == 100) {

					this.$confirm('当前应用已存在代码, 是否重新下载?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
						.then(() => {
							this.step(this.downloadForm,app_name)
						})

				} else {
					this.step(this.downloadForm,app_name)
				}

			},

			format(percentage) {
				if (percentage == 0) {
					return percentage === 0 ? '' : `${percentage}%`;
				} else {
					return percentage === 100 ? '✓' : `${percentage}%`;
				}

			},

			color(percentage) {
				return percentage === 100 ? 'green' : `${percentage}%`;
			},

			// 监听page_size改变的事件
			handleSizeChange(newsize) {
				this.queryInfo.page_size = newsize;
				this.getData();
			},
			// 监听页码值改变的事件
			handleCurrentChange(newpage) {
				this.queryInfo.page = newpage;
				this.getData();
			}

			// 监听switch开关的状态
			// async userStateChanged() {
			//   console.log()
			//   const {data: res} = await this.$axios.put(
			//     `users/${userinfo.id}/state/${userinfo.mg_state}`
			//   )
			//   if (res.meta.status ! == 200) {
			//     userinfo.mg_state = !userinfo.mg_state
			//     return this.$message.error('更新用户状态失败')
			//   }
			//   this.$message.success('更新用户状态成功')
			// },

		}

	};
</script>

<style scoped>
</style>
