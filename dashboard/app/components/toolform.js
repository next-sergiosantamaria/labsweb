let ToolForm = Vue.component("toolform-component", {
	template:	`<div class="card">
					<form class="m-0">
						<div class="card-body">
							<h4 class="cart-title">Tool form</h4>
							<p class="card-text">Required information</p>
							<div class="row">
								<div class="col">
									<div class="form-group">
										<label for="title">
											<i class="fa fa-cog"></i>
											Title
										</label>
										<input id="title" type="text" class="form-control" v-model="tool.title" placeholder="Tool title or name">
									</div>
								</div>
								<div class="col">
									<div class="form-group">                                           
										<label for="tags">
											<i class="fa fa-tag"></i>
											Tags
										</label>
										<select id="tags" class="form-control" v-model="tool.tag">
											<option v-for="tag in tags" v-bind:value="tag | formatName">{{ tag }}</option>
										</select>
									</div>
								</div>  
							</div>  

							<div class="row">
								<div class="col">
									<div class="form-group">
										<label for="description">
											<i class="fa fa-align-left"></i>
											Description
										</label>
										<textarea id="description" class="form-control" v-model="tool.description" placeholder="Short description to introduce tool applications..."></textarea>
									</div>
								</div>
								<div class="col">
									<div class="form-group">                                            
										<label for="status">
											<i class="fa fa-thermometer-full"></i>
											Status
										</label>
										<select id="status" class="form-control" v-model="tool.status">
											<option v-for="state in states" v-bind:value="state | formatName">{{ state }}</option>
										</select>
									</div>
								</div>
							</div>

							<linklist-input title="Links" icon="" :links="decodeLinks(tool.links)" v-on:change="handleLinks"></linklist-input>
						</div>

						<div class="card-footer">
							<p class="card-text">Optional information</p>

							<linklist-input title="Graphic material" iconClass="fa fa-bar-chart" :links="decodeLinks(tool.graphic)" v-on:change="handleGraphic"></linklist-input>

							<div class="form-group">
								<label for="demo">
									<i class="fa fa-film"></i>
									Demo
								</label>
								<input id="demo" type="text" class="form-control" v-model="tool.demo" placeholder="Url address to demo resource (video, ppt, ...).">
							</div>

							<steps-input title="First steps" iconClass="fa fa-list-ol" :steps="decodeSteps(tool.steps)"></steps-input>
								
							<button type="button" class="btn btn-pill btn-primary btn-block mt-5 mb-4" v-on:click="sendInfo">
								<i class="fa fa-floppy-o mr-2"></i>
								Save
							</button>
						</div>
					</form>
				</div>`,
	data(){
		return{
			toolKey: "",
			tool: {
				title: "",
				description: "",
				tag: "",
				status: "",
				demo: "",
				graphic: "",
				firststeps: ""
			},
			tags: [
				"Frontend", 
				"Backend", 
				"Mobile", 
				"Big Data", 
				"IoT", 
				"Cloud", 
				"DevOps", 
				"Security", 
				"Blockchain", 
				"DevOps", 
				"Human Computer Interfaces",
				"UX",
				"UI"
			],
			states: [
				"Adopt",
				"Wait",
				"Work in progress"
			]
		}
	},
	created() {
		this.toolKey = (this.$route.params.id && this.$route.params.id !== "new") ? this.$route.params.id : "new"; 

		if (this.toolKey && this.toolKey !== "new") {
			let table = `tools/${ this.toolKey }`;

			this.$database.get(table, 
				(res) => {
					if (res) {
						Object.entries(res).forEach(([key, value])=>{
							this.tool[key] = value;
						});
					}
				}, 
				(err) => {
					console.error(err);
					EventBus.$emit("alert", { type: "danger", message: "Error getting tool info. More details on console" })
				}
			);
		}
	},
	filters: {
		formatName(tag) {
			if (!tag) return "";
			
			tag = tag.toString().replace(" ", "");
			return tag.toLowerCase();
		}
	},
	methods: {
		encodeLinks(list) {
			let texts = [];
			list.forEach((link) => {
				texts.push(`${ link.title }||${ link.url }`);
			});
			return texts.join("\n");
		},
		decodeLinks(text) {
			let links = [];
			
			if (text) {
				links = text.split("\n").map((item) => {
					let splited = item.split("||");

					return {
						title: splited[0],
						url: splited[1]
					};
				});
			}

			return links;
		},
		encodeSteps(list) {
			return list.join("||");
		},
		decodeSteps(text) {
			return (text) ? text.split("||") : [];
		},
		sendInfo() {
			if (this.toolKey === "new") {
				this.$database.append('tools/', this.tool, console.log, 1);
			} else {
				this.$database.update('tools/', this.toolKey, this.tool, console.log, console.error);
			}
			Router.push({ name: "tools" });

		},
		validateInfo() {

		},
		handleLinks(links) {
			this.tool.links = this.encodeLinks(links);
		},
		handleGraphic(links) {
			this.tool.graphic = this.encodeLinks(links);
		},
		handleSteps(steps) {
			this.tool.steps = this.encodeSteps(steps);
		}
	},
	components: {
		"linklist-input": LinkListInput,
		"steps-input": StepsInput
	}
});