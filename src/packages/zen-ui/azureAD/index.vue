<template>
	<div>
		<div class="ad-message">
			<div class="ad-message-icon">
				<a-icon type="exclamation-circle" />
			</div>
			<div class="progress-box">
				<div v-if="autoLogin_data">
					<div class="top">
						<div>
							Redirecting to
							<a href="#" @click="redirectURL()">Azure AD zenlayer</a>
						</div>
						<div>
							<a href="javascript:void(0);" @click="closeProgress">Cancel</a>
						</div>
					</div>
					<div class="bottom">
						<a-progress :percent="percent" :showInfo="false"></a-progress>
					</div>
				</div>
				<div v-else>
					<p>Log in with</p>
					<a href="#" @click="redirectURL()">Azure AD zenlayer</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'azureAD',
	model: {
		prop: 'percent',
		event: 'change'
	},
	props: {
		waitTime: {
			type: Number,
			default: 4000
		},
		percent: {
			type: Number,
			default: 0
		},
		autoLogin: {
			type: Boolean,
			default: true
		},
		azureLoginURL: {
			type: String,
			required: true
		},
		authority: {
			type: String,
			default:
				'https://login.microsoftonline.com/0d27725c-b11d-49f0-b479-a26ae758f26d'
		},
		clientId: {
			type: String,
			default: '7ab832fd-850d-40a2-a091-eb8461ea93e8'
		},
		redirectUri: {
			type: String,
			default: 'http://localhost:8088/login'
		},
		loginRequest: {
			type: Object,
			default() {
				return {
					scopes: ['user.read'] // optional Array<string>
				}
			}
		}
	},
	watch: {
		autoLogin(newValue) {
			this.autoLogin_data = newValue
			if (newValue) {
				this.startLogin()
			}
		}
	},
	data() {
		return {
			autoLogin_data: this.autoLogin,
			timer: null,
			loginiTime: null
		}
	},
	created() {
		if (!this.autoLogin) {
			return
		}
		this.startLogin()
	},
	methods: {
		startLogin() {
			this.progress()

			this.loginiTime = setTimeout(() => {
				let href =
					this.authority +
					'/oauth2/authorize?client_id=' +
					this.clientId +
					'&response_type=id_token+token&redirect_uri=' +
					this.redirectUri +
					'&nonce=zenlayer&resource=https%3A%2F%2Fgraph.microsoft.com%2F'
				this.$emit('change', 100)
				window.location.href = href
				clearTimeout(this.loginiTime)
			}, this.waitTime)
		},
		redirectURL() {
			if (
				this.$route.path === this.azureLoginURL ||
				this.$route.name === this.azureLoginURL
			) {
				this.$router.go(0)
			} else {
				this.$router.push(this.azureLoginURL)
			}
		},
		closeProgress() {
			this.autoLogin_data = false
			if (this.loginiTime) {
				clearTimeout(this.loginiTime)
			}
			clearTimeout(this.timer)
		},
		progress() {
			this.$emit('change', this.percent + 3)
			if (this.timer) {
				clearTimeout(this.timer)
				this.timer = null
			}
			if (this.percent < 97 && !this.timer) {
				this.timer = setTimeout(() => {
					this.progress()
				}, 200)
			}
		},
		acquireTokenSilent() {
			this.progress()
			this.$emit('accessTokenCallback', response.accessToken)
		}
	}
}
</script>
<style lang="less" scope>
.ad-message {
	display: flex;
	margin-top: 10px;
	padding: 12px;
	border: 1px solid #bbbec7;
	border-radius: 4px;
	.ad-message-icon {
		width: auto;
		padding-right: 20px;
	}
	.progress-box {
		flex: 1;
		.top {
			display: flex;
			justify-content: space-between;
			.information-circled {
				color: @primary-color;
				margin-right: 10px;
			}
		}
		.bottom {
			margin-top: 10px;
		}
	}
	.t-center {
		text-align: center;
	}
}
</style>
