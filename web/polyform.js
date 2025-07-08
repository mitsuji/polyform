const fromFormattedNumber = (txt) => Number(txt.replaceAll(",",""));
const toFormattedNumber = (num) => num.toLocaleString('ja-JP');

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
            const calcSum = (form0) => {
                let quantityTotal = 0;
                let sumTotal = 0;
                for(let i = 0; i < 3; i++) {
                    const item = form0[`item${i}`];
                    const blankPrice = (item.price == "");
                    const blankQuantity = (item.quantity == "");
                    const price = (blankPrice) ? NaN : fromFormattedNumber(item.price);
                    const quantity = (blankQuantity) ? NaN : Math.trunc(fromFormattedNumber(item.quantity));
                    const sum = price * quantity;
                    item.price = isNaN(price) ? "" : toFormattedNumber(price);
                    item.quantity = isNaN(quantity) ? "" : toFormattedNumber(quantity);
                    item.sum = isNaN(sum) ? "" : toFormattedNumber(sum);
                    quantityTotal += (blankPrice && blankQuantity) ? 0 : quantity;
                    sumTotal +=  (blankPrice && blankQuantity) ? 0 : sum;
                }
                form0.quantityTotal = (isNaN(quantityTotal) || quantityTotal == 0)
                                            ? "" : toFormattedNumber(quantityTotal);
                form0.sumTotal = (isNaN(sumTotal) || quantityTotal == 0)
                                        ? "" : toFormattedNumber(sumTotal);
            };
            const saveDefault = (event) => {
                console.log(`saveDefault ${event.target.value}`);
                event.target.dataset.defaultValue = event.target.value;
            };
            const changePrice = (index, event) => {
                console.log (`changePrice called  ${event.target.dataset.defaultValue} ${event.target.value}`);
                if (isNaN(event.target.value)) {
                    alert("Price must be a number.");
                    form.value[`item${index}`].price = event.target.dataset.defaultValue;
                    return;
                }
                calcSum(form.value);
            };
            const changeQuantity = (index, event) => {
                console.log (`changeQuantity called  ${event.target.dataset.defaultValue} ${event.target.value}`);
                if (isNaN(event.target.value)) {
                    alert("Quantiry must be a number.");
                    form.value[`item${index}`].quantity = event.target.dataset.defaultValue;
                    return;
                }
                calcSum(form.value);
            };
            const appendForm = (index) => {
                forms.value.push ({code:'',name:'',age:'',isActive:false,
                                   item0:{code:'',name:'',price:'',quantity:'',sum:''},
                                   item1:{code:'',name:'',price:'',quantity:'',sum:''},
                                   item2:{code:'',name:'',price:'',quantity:'',sum:''}
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
            const loadData =  (newData) => {
                forms.value = newData;
                forms.value.forEach((f,index) => {
                    if (index == 0){
                        f.isActive = true;
                    } else {
                        f.isActive = false;
                    }
                    calcSum(f);
                });
                form.value = forms.value.find((item) => item.isActive);
            };
            const test = () => {
                const newData = [{code:'101',name:'三辻',age:'47',
                                 item0:{code:'101',name:'PC',price:'50000',quantity:'1',sum:'50000'},
                                 item1:{code:'102',name:'モニタ',price:'10000',quantity:'2',sum:'20000'},
                                 item2:{code:'',name:'',price:'',quantity:'',sum:''}
                                },
                                {code:'102',name:'鈴木',age:'35',
                                 item0:{code:'',name:'',price:'',quantity:'',sum:''},
                                 item1:{code:'',name:'',price:'',quantity:'',sum:''},
                                 item2:{code:'',name:'',price:'',quantity:'',sum:''}
                                },
                                {code:'103',name:'森田',age:'25',
                                 item0:{code:'101',name:'PC',price:'50000',quantity:'1',sum:'50000'},
                                 item1:{code:'102',name:'モニタ',price:'10000',quantity:'2',sum:'10000'},
                                 item2:{code:'103',name:'タブレット',price:'30000',quantity:'3',sum:'30000'}
                                }];

                loadData(newData);
            };
            const openSubwin = (index) => {
                window.open(`subwin.html?callback=setItem&index=${index}`, "URL", "width=280,height=320,toolbar=0");
            };
            const setItem = (index, code, name ,price) => {
                console.log(`fromSubwin called ${index}, ${code}, ${name}, ${price}`);
                const item = form.value[`item${index}`];
                item.code = code;
                item.name = name;
                item.price = price;
                calcSum(form.value);
            };
            onMounted (async () => {
                // [TODO] API を叩いてとってくる
                const initForms = [{code:'',name:'',age:'',
                                    item0:{code:'',name:'',price:'',quantity:'',sum:''},
                                    item1:{code:'',name:'',price:'',quantity:'',sum:''},
                                    item2:{code:'',name:'',price:'',quantity:'',sum:''}
                                   }];
                loadData(initForms);

            });
            window.setItem = setItem; // サブウィンドウから呼び出すためにグローバルに登録
            return { forms,form, appendForm, focusForm, deleteForm, save, test, openSubwin, saveDefault, changePrice, changeQuantity };
        }
    });
    app.config.compilerOptions.delimiters = ['(#', '#)'];
    app.mount('#polyform');
});
