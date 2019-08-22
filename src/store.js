import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token:'',
    topTitle:"",
    isVerifyOrTag:true,//当前模式是监测模式还是标注模式 true是监测模式 false是标注模式
    showimg:{showimg:false,imgObj:{imgUrl:'',frameData:{}},tagResult:{miss:0,verifyFrameArr:[]}},
    frameResult:[],
    isAddDraw:false,//在标注模式下新增框 true新增 false不新增
    isShowCategory:false,//在画框模式或修改框模式下 true显示 false不显示
    newaddframearr:[],//新增框坐标
    optframeObj:{},//选中的框信息
    isradectCategory:false,//修改框显示对应的选项
    isclearAddframe:false,//删除新增的框
  },
  // modules: {
  //   tagframe
  // },
  mutations: {
    showbigimg(state,newVal){
      state.showimg = newVal;
    },
    topTitleText(state,newVal){
      state.topTitle = newVal;
    },
    resultFrame(state,newVal){
      state.frameResult = newVal;
    },
    addDrawframe(state,newVal){
      state.newaddframearr = newVal;
    },
    seloptframeObj(state,newVal){
      state.optframeObj = newVal;
    },
  },
  actions: {
    showbigimg(context){
      context.commit('showbigimg');
    },
    topTitleText(context){
      context.commit('topTitleText');
    },
    resultFrame(context){
      context.commit('resultFrame');
    },
    addDrawframe(context){
      context.commit('addDrawframe');
    },
    seloptframeObj(context){
      context.commit('seloptframeObj');
    },
  }
});
