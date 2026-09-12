const yen=value=>`${Math.round(Number.isFinite(value)?value:0).toLocaleString('ja-JP')}円`;
const num=id=>Math.max(0,Number(document.getElementById(id)?.value||0));
const signedYen=value=>`${value<0?'−':''}${yen(Math.abs(value))}`;
const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
const pct=id=>num(id)/100;
function salaryDeduction(annual){if(annual<=1900000)return 650000;if(annual<=3600000)return annual*.3+80000;if(annual<=6600000)return annual*.2+440000;if(annual<=8500000)return annual*.1+1100000;return 1950000}
function incomeTax(taxable){if(taxable<=0)return 0;if(taxable<=1950000)return taxable*.05;if(taxable<=3300000)return taxable*.1-97500;if(taxable<=6950000)return taxable*.2-427500;if(taxable<=9000000)return taxable*.23-636000;if(taxable<=18000000)return taxable*.33-1536000;if(taxable<=40000000)return taxable*.4-2796000;return taxable*.45-4796000}
const calculators={
  takehome(){const monthly=num('gross'),bonus=num('bonus'),social=pct('social'),annual=monthly*12+bonus,insurance=annual*social,taxable=Math.max(0,annual-salaryDeduction(annual)-580000-insurance),tax=incomeTax(taxable)*1.021,resident=taxable>0?taxable*.1+5000:0,net=annual-insurance-tax-resident;set('main',yen(net/12));set('r1',yen(net));set('r2',yen(insurance));set('r3',yen(tax));set('r4',yen(resident));set('status',`額面年収に対する手取り率は約${annual?Math.round(net/annual*100):0}%です。`)},
  rent(){const take=num('take'),ratio=Math.min(pct('ratio'),1),rent=take*ratio,rest=take-rent;set('main',yen(rent));set('r1',yen(rent*12));set('r2',`${Math.round(ratio*100)}%`);set('r3',yen(rest));set('status',`家賃を払った後に、生活費や貯金へ回せる金額は${yen(rest)}です。`)},
  solo(){const ids=['rent','food','utility','phone','transport','daily','fun','other'],total=ids.reduce((sum,id)=>sum+num(id),0),balance=num('income')-total;set('main',yen(total));set('r1',yen(total*12));set('r2',yen(total-num('rent')));set('r3',signedYen(balance));set('status',balance>=0?`毎月${yen(balance)}の余裕があります。`:`毎月${yen(-balance)}の赤字です。入力項目を見直しましょう。`)},
  car(){const fuel=num('km')/Math.max(num('eff'),.1)*num('gas'),annual=num('loan')*12+num('parking')*12+num('insurance')+num('tax')+num('inspection')/2+fuel+num('maint');set('main',yen(annual));set('r1',yen(annual/12));set('r2',yen(fuel));set('r3',yen(num('loan')*12));set('status',`毎月の家計では約${yen(annual/12)}を車用に確保する目安です。`)},
  food(){const monthly=num('take')*Math.min(pct('ratio'),1);set('main',yen(monthly));set('r1',yen(monthly/30.4));set('r2',yen(monthly/4.345));set('r3',yen(monthly*12));set('status',`1日あたりの目安は${yen(monthly/30.4)}です。外食を含めるかを先に決めると管理しやすくなります。`)},
  fixed(){const ids=['rent','phone','utility','insurance','subs','loan','parking','other'],total=ids.reduce((sum,id)=>sum+num(id),0),income=num('income'),rest=income-total,rate=income?total/income*100:0;set('main',yen(total));set('r1',yen(total*12));set('r2',signedYen(rest));set('r3',`${rate.toFixed(1)}%`);set('status',rest>=0?`固定費を払った後に${yen(rest)}残ります。`:`固定費だけで手取りを${yen(-rest)}上回っています。`)},
  savings(){const income=num('income'),save=income-num('fixed')-num('variable');set('main',signedYen(save));set('r1',signedYen(save*12));set('r2',`${(income?save/income*100:0).toFixed(1)}%`);set('r3',save>=0?'黒字':'赤字');set('status',save>=0?`このペースを1年続けると${yen(save*12)}です。`:`毎月${yen(-save)}の支出削減か収入増が必要です。`)},
  couple(){const ids=['rent','food','utility','phone','transport','insurance','fun','other'],total=ids.reduce((sum,id)=>sum+num(id),0),share=Math.min(pct('share'),1);set('main',yen(total));set('r1',yen(total*share));set('r2',yen(total*(1-share)));set('r3',yen(total*12));set('status',`入力した割合では、自分${Math.round(share*100)}%・相手${Math.round((1-share)*100)}%の負担です。`)},
  child(){const ids=['school','food','clothes','medical','lesson','saving','other'],total=ids.reduce((sum,id)=>sum+num(id),0);set('main',yen(total));set('r1',yen(total*12));set('r2',yen(total*18*12));set('status',`18年間の表示は現在の月額を変えずに延長した比較用の参考値です。`)},
  usable(){const annual=num('annual'),net=annual*Math.min(pct('netrate'),1),monthly=net/12,usable=monthly-num('saving')-num('fixed');set('main',signedYen(usable));set('r1',yen(monthly));set('r2',yen(num('saving')));set('r3',yen(num('fixed')));set('r4',signedYen(usable/30.4));set('status',usable>=0?`自由に使える目安は1日${yen(usable/30.4)}です。`:`設定した貯金と固定費が、手取り目安を${yen(-usable)}上回っています。`)}
};
function run(){const key=document.body.dataset.tool;if(calculators[key])calculators[key]()}
function resetForm(){document.querySelector('form')?.reset();run()}
document.addEventListener('input',event=>{if(event.target.matches('input,select'))run()});
document.addEventListener('DOMContentLoaded',run);
