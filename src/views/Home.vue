<template>
	<div class="home">
		<el-container>

			<el-header>
				<div>
					<img alt="" src="">
					<span>扩容系统</span>
				</div>
				<el-button type="info">退出</el-button>
			</el-header>

			<!-- 页面主体区域 -->
			<el-container>
				<!-- 侧边栏 -->
				<el-aside :width="isCollapse ? '70px' : '170px'">
					<div class="toggle-button" @click="toggleCollapse">|||
					</div>
					<!-- 侧边栏菜单区域 -->
					<el-menu :collapse="isCollapse" :collapse-transition="false" active-text-color="#ffd04b" background-color="#333744"
					 router text-color="#fff" unique-opened>
						<!-- 一级菜单 -->
						<el-submenu index="1">
							<template slot="title">
								<i class="el-icon-location" />
								<span>扩容任务</span>
							</template>
							<el-menu-item index="/tasks">任务列表</el-menu-item>
						</el-submenu>

						<el-submenu index="2">
							<template slot="title">
								<i class="el-icon-location" />
								<span>应用管理</span>
							</template>
							<el-menu-item index="/project">应用编辑</el-menu-item>
							<el-menu-item index="/init">服务器初始化</el-menu-item>
						</el-submenu>

					</el-menu>
				</el-aside>

				<el-main>
					<router-view />
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	// @ is an alias to /src

	export default {
		name: 'Home',
		data: () => ({
			// 是否折叠
			isCollapse: false
		}),
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			toggleCollapse() {
				this.isCollapse = !this.isCollapse;
			}
		}
	}
</script>

<style scoped>
	.home {
		height: 100vh;
	}

	.el-container {
		height: 100%;
	}

	.el-header {
		background-color: #373d41;
		color: #ffffff;
		line-height: 60px;
		display: flex;
		justify-content: space-between;
		padding-left: 0;
		align-items: center;
		font-size: 20px;
	}

	.el-aside {
		background-color: #333744;
		color: #000;
	}

	.el-menu {
		border-right: none;
	}

	.el-main {
		background-color: #E9EEF3;
		color: #333;
	}

	.toggle-button {
		background-color: #4a5064;
		font-size: 10px;
		line-height: 24px;
		color: #ffffff;
		text-align: center;
		letter-spacing: 0.2em;
		cursor: pointer;
	}
</style>
