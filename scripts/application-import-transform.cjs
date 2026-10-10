module.exports=function(){
  function project(node){
    if(node?.type==='StringLiteral'&&node.value.startsWith('~/routes/')){
      node.value='owned-application/views/'+node.value.slice('~/routes/'.length);
    }
  }
  return {visitor:{
    ImportDeclaration(path){project(path.node.source)},
    ExportNamedDeclaration(path){project(path.node.source)},
    ExportAllDeclaration(path){project(path.node.source)},
    CallExpression(path){if(path.node.callee.type==='Import')project(path.node.arguments[0])},
  }};
};
