<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>扩容任务</el-breadcrumb-item>
			<el-breadcrumb-item>任务列表</el-breadcrumb-item>
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
					<el-button type="primary" @click="addDialogVisible=true">添加任务
					</el-button>
				</el-col>
			</el-row>

			<!-- 应用列表区域 -->
			<el-table :data="tableData" border highlight-current-row :default-sort = "{prop: 'last', order: 'descending'}" size="small">
				<el-table-column type="index" />
				<el-table-column label="任务名称" prop="name" sortable width="180px"/>
				<el-table-column label="关联应用" prop="app_name" sortable />
				<el-table-column label="关联playbook" prop="playbook" sortable>
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" placement="right">
							<div v-html="tobreak(scope.row.playbook)" slot="content"></div>
							<div class="oneLine">{{scope.row.playbook}}</div>
						</el-tooltip>
					</template>
				</el-table-column>

				<el-table-column label="创建者" prop="creator" sortable/>
				<el-table-column prop="born" label="创建时间" sortable/>
				<el-table-column prop="last" label="上次执行时间" sortable/>
				<el-table-column label="操作" width="200px">
					<template slot-scope="scope">
						<el-button type="primary" plain size="mini" @click="expansion(scope.row.app_id, scope.row.playbook, scope.row.name)">扩容</el-button>
						<el-button icon="el-icon-edit" size="mini" type="primary" @click="showEditDialog(scope.row.id)" />
						<el-button icon="el-icon-delete" size="mini" type="danger" @click="remove(scope.row.id)" />
						
						<!-- <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button> -->
						
						<el-dialog
						  title="执行结果"
						  :visible.sync="dialogVisible"
						  width="50%">
						  <!-- :before-close="handleClose" -->
						  <json-viewer :value="callbackData" copyable boxed sort expand-depth=2></json-viewer>
						  <!-- <span>{{ callbackData }}</span> -->
						  <span slot="footer" class="dialog-footer">
						    <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
						    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
						  </span>
						</el-dialog>
						
					</template>
				</el-table-column>
			</el-table>

			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" @current-page=queryInfo.page
			 :page-sizes="[15, 30, 50, 100]" :page-size=queryInfo.page_size layout="total, sizes, prev, pager, next, jumper"
			 :total=total>
			</el-pagination>

		</el-card>

		<!-- 添加对话框 -->
		<el-dialog :visible.sync="addDialogVisible" title="添加应用" width="50%">
			<!-- 内容主体区域 -->
			<el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="85px">
				<el-form-item label="任务名称" prop="name">
					<el-input v-model="addForm.name" placeholder="唯一值 英文名称" />
				</el-form-item>
				<el-form-item label="创建者" prop="creator">
					<el-input v-model="addForm.creator" />
				</el-form-item>
				<el-form-item label="playbook" prop="playbook">
					<el-input v-model="addForm.playbook" :rows="10" type="textarea" />
				</el-form-item>
				<el-form-item label="关联应用" prop="app_id">
					<el-select v-model="addForm.app_id" clearable placeholder="请选择应用">
						<el-option v-for="item in apps" :key="item.id" :label="item.app_name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>


			</el-form>
			<!-- 底部区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogClosed()">取 消</el-button>
				<el-button type="primary" @click="add()">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 修改应用对话框 -->
		<el-dialog :visible.sync="editDialogVisible" title="修改应用" width="50%" @close="editDialogClosed">
			<el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="85px">
				<el-form-item label="任务名称" prop="name">
					<el-input v-model="editForm.name"/>
				</el-form-item>
				<el-form-item label="创建者" prop="creator">
					<el-input v-model="editForm.creator" />
				</el-form-item>
				<el-form-item label="playbook" prop="playbook">
					<el-input v-model="editForm.playbook" :rows="10" type="textarea" />
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
	import * as API from "../api/v1"

	export default {
		data() {
			return {
				callbackData: '',
				apps: [],
				tableData: [],
				// 分页
				total: 0,

				// 查询数据的表单
				queryInfo: {
					search: '',
					// 当前的页数
					page: 1,
					// 当前每页显示多少条
					page_size: 15,
					// 排序
					ordering: 'last'
				},

				// 扩容任务传参
				playInfo: {
					app_id: '',
					playbook:'',
					name:''
					
				},

				// 新建tasks的表单
				addForm: {
					name: '',
					creator: '',
					playbook: '---\n- hosts: all\n  gather_facts: no\n  tasks:\n    - name: run scripts\n      shell: \" \"',
					app_id: ''
				},

				addFormRules: {
					name: [{
							required: true,
							tragger: 'blur'
						},
						{
							min: 3,
							max: 25,
							message: '任务名称的长度在3到25个字符之间',
							trigger: 'blur'
						}
					],
					creator: [{
							required: true,
							tragger: 'blur'
						},
						{
							min: 2,
							max: 15,
							message: '创建名称的长度在2到15个字符之间',
							trigger: 'blur'
						}
					],
					playbook: [{
							required: true,
							tragger: 'blur'
						},
						{
							min: 10,
							max: 1024,
							message: '创建名称的长度最小为10',
							trigger: 'blur'
						}
					],
					
				},
				
				//
				addDialogVisible: false,

				// 查询到的用户信息对象
				editForm: {
					// id: 0,
					name: '',
					creator: '',
					playbook: '',
					// app_id: ''
				},

				// 修改表单的验证规则对象
				editFormRules: {
					name: [{
							required: true,
							message: '请输入任务名称',
							tragger: 'blur'
						},
						{
							min: 3,
							max: 25,
							message: '任务名称的长度在3到25个字符之间',
							trigger: 'blur'
						}
					],
					creator: [{
							required: true,
							message: '请输入创建者名称',
							tragger: 'blur'
						},
						{
							min: 2,
							max: 15,
							message: '创建者的长度在2到15个字符之间',
							trigger: 'blur'
						}
					],
					playbook: [{
							required: true,
							tragger: 'blur'
						},
						{
							min: 10,
							max: 1024,
							message: ' 最小10个字符',
							trigger: 'blur'
						}
					]
					
					
				},

				// 控制修改对话框的显示与隐藏
				editDialogVisible: false,
				
				// 日志显示框默认隐藏
				dialogVisible: false
			};
		},

		mounted() {
			this.getData();
		},

		methods: {
			// 获取应用列表
			getData: function getData() {
				// console.log(this.queryInfo)
				API.getTasks(this.queryInfo)
					.then(res => {
						// console.log(res)
						this.tableData = res.results;
						this.total = res.count;
					})
					.catch(function(error) {
						console.log(error);
					});

				// 获取所有apps
				API.getApps().then(response => {
					this.apps = response.results;
					// console.log(response.results)
				})

			},

			// 将 \n 换为 <br/>标签
			tobreak: function ToBreak(val) {
				// console.log(val);
				return val.split("\n").join("<br/>");

			},
			
			// 监听page_size改变的事件
			// eslint-disable-next-line camelcase
			handleSizeChange(page_size) {
				console.log(page_size);
				// eslint-disable-next-line camelcase
				this.queryInfo.page_size = page_size;
				this.getData();
			},
			
			// 监听页码值改变的事件
			handleCurrentChange(page) {
				console.log(page);
				this.queryInfo.page = page;
				this.getData();
			},

			// 监听添加用户对话框的关闭事件
			addDialogClosed() {
				this.addDialogVisible = false;
				this.$refs.addFormRef.resetFields();
			},
			
			// 点击添加确定按钮
			add: function addData() {
				console.log(this.$refs.addFormRef.validate);
				this.$refs.addFormRef.validate(valid => {
					if (!valid) return;
					// 可以发起添加应用网络请求
					API.postTask(this.addForm)
						.then(res => {
							if (res.status !== 201) {
								return this.$message.error('添加失败 ！');
							}
							// console.log(res)
							// 隐藏添加应用对话框
							this.addDialogVisible = false;
							this.$message.success('添加成功 ！');

							// 重新获取应用列表数据
							this.getData();
							this.$refs.addFormRef.resetFields();
						});
				});
			},

			// 根据id删除
			remove: function removeById(id) {
				// console.log(id)
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then((event) => {
						console.log(event);
						API.deleteTask(id)
							.then(res => {
								if (res.status !== 204) {
									console.log(res)
									return this.$message.error('删除失败 ！');
								}
								this.$message.success('删除成功 ！');
								this.getData();
							});
					});
			},

			// 显示编辑对话框
			showEditDialog: function showEditDialog(id) {
				API.getTask(id)
					.then(res => {
						if (res.status !== 200) {
							return this.$message.error('查询失败 ！');
						}
						console.log(res)
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
					// console.log(valid)
					if (!valid) return;
					// 可以发起添加应用网络请求
					API.putTask(this.editForm.id, {
							name: this.editForm.name,
							creator: this.editForm.creator,
							playbook: this.editForm.playbook,
							app_id: this.editForm.app_id
						})
						.then(res => {
							if (res.status !== 200) {
								return this.$message.error('修改失败 ！');
							}
							console.log(res)
							// 关闭对话框
							this.editDialogVisible = false;
							// 刷新列表
							this.getData();
							// 提示修改成功
							this.$message.success('修改成功 ！');
						});
				});
			},

			// 扩容任务
			expansion: function expansionPlay(app_id, playbook, name) {
				this.$confirm('执行扩容操作, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'info'
					})
					.then((event) => {
						console.log(event);

						// console.log(app_id)
						// console.log(playbook)
						this.playInfo.app_id = app_id
						this.playInfo.playbook = playbook
						this.playInfo.name = name

						API.postPlay(this.playInfo)
							.then(res => {
								if (res.status !== 200) {
									return this.$message.error('执行失败 ！');
								}
								console.log(res.data);

								this.$message.success('执行成功 ！');
								this.callbackData = res.data;
								this.dialogVisible = true;

								// 重新获取应用列表数据
								this.getData();
							});
						});
			},
			
			// handleClose(done) {
			// 	this.$confirm('确认关闭？')
			// 	.then(_ => {
			// 		done();
			// 	})
			// 	.catch(_ => {});
			// }
	
		}

	};
</script>

<style scoped>
.oneLine {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>