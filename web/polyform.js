window.addEventListener('load',(event) => {
    const { createApp, ref, onMounted, watch } = Vue;
    const app = createApp({
        setup() {
            const forms = ref ();
            const form = ref ();
            watch (form, async (newForm, oldForm) => {
                // [TODO] フォームに入力した時点でエラーや警告を出したいときはここを使う
                console.log ("form changed...");
            },{deep : true});
            const appendForm = (index) => {
                forms.value.push ({code:'',name:'',age:'',isActive:false,
                                   item0:{code:'',name:'',price:''},
                                   item1:{code:'',name:'',price:''},
                                   item2:{code:'',name:'',price:''}
                                  });
            };
            const focusForm = (index) => {
                forms.value.forEach((f) => f.isActive = false);
                const targetForm = forms.value[index];
                targetForm.isActive = true;
                form.value = targetForm;
            };
            const deleteForm = (index) => {
                if(!confirm("本当に削除しますか?(元に戻せません)")) return;
                if (forms.value.length <= 1) return;
                if (forms.value[index].isActive) return;
                forms.value.splice(index,1);
            };
            const save = () => {
                const saveForms = forms.value.concat();
                // [TODO] API を叩いて保存する
                console.log(saveForms);
            };
            const test = () => {
                form.value.code = '201';
                form.value.name = 'やまだ';
                form.value.age = '89';
                form.value.item0.code = '111';
                form.value.item0.name = '家電1';
                form.value.item0.price = '1000';
                form.value.item1.code = '222';
                form.value.item1.name = '家電2';
                form.value.item1.price = '2000';
                form.value.item2.code = '333';
                form.value.item2.name = '家電3';
                form.value.item2.price = '3000';
            };
            const openSubwin = (index) => {
                window.open(`subwin.html?index=${index}`, "URL", "width=280,height=320,toolbar=0");
            };
            const setItem = (index, code, name ,price) => {
                console.log(`fromSubwin called ${index}, ${code}, ${name}, ${price}`);
                const item = form.value[`item${index}`];
                item.code = code;
                item.name = name;
                item.price = price;
            };
            onMounted (async () => {
                // [TODO] API を叩いてとってくる
//                const initForms = [{code:'101',name:'三辻',age:'47',
//                                    item0:{code:'101',name:'PC',price:'50000'},
//                                    item1:{code:'102',name:'モニタ',price:'10000'},
//                                    item2:{code:'',name:'',price:''}
//                                   },
//                                   {code:'102',name:'鈴木',age:'35',
//                                    item0:{code:'',name:'',price:''},
//                                    item1:{code:'',name:'',price:''},
//                                    item2:{code:'',name:'',price:''}
//                                   },
//                                   {code:'103',name:'森田',age:'25',
//                                    item0:{code:'101',name:'PC',price:'50000'},
//                                    item1:{code:'102',name:'モニタ',price:'10000'},
//                                    item2:{code:'103',name:'タブレット',price:'30000'}
//                                   }];
                const initForms = [{code:'',name:'',age:'',
                                    item0:{code:'',name:'',price:''},
                                    item1:{code:'',name:'',price:''},
                                    item2:{code:'',name:'',price:''}
                                   }];
                forms.value = initForms;
                forms.value.forEach((f,index) => {
                    if (index == 0){
                        f.isActive = true;
                    } else {
                        f.isActive = false;
                    }
                });
                form.value = forms.value.find((item) => item.isActive);

            });
            window.setItem = setItem; // サブウィンドウから呼び出すためにグローバルに登録
            return { forms,form, appendForm, focusForm, deleteForm, save, test, openSubwin};
        }
    });
    app.config.compilerOptions.delimiters = ['(#', '#)'];
    app.mount('#polyform');
});
