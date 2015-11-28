attribute vec4 aVertexVector;//x y direction  z w position
   attribute float aVertexNumber;
      uniform float uWidth;
      uniform float uHeight;
      varying vec2 vTextureCoord;

       uniform sampler2D uSampler;
       uniform sampler2D uData;
       varying vec4 vColor;
       //根据方向向量direction的值，确定下一个格点的位置
       vec2 updateIj(vec2 ij,vec2 direction){
           vec2 result = ij;
           float absTan = abs(direction.y/direction.x);
           //根据方向角度的tan，确定下一个点的位置
          //tan22.5  0.4142
          //tan67.5  2.4142
           if(absTan < 0.4142){
               if(direction.x > 0.0){
                   result.x += 1.0;
               }else{
                   result.x -= 1.0;
               }
           }else{
               if(direction.y > 0.0){
                   result.y += 1.0;
               }else{
                   result.y -= 1.0;
               }
               if(absTan < 2.4142){
                   if(direction.x > 0.0){
                       result.x += 1.0;
                   }else{
                       result.x -= 1.0;
                   }
               }
           }
           return result;
       }
       //根据坐标值读取数据纹理中的数据
       vec4 dataFromIj(vec2 ij){
           vec2 coord;
           coord = vec2(1.0/uWidth*(ij.x+0.5), 1.0/uHeight*(ij.y+0.5));//ij对应的纹理坐标
           return (texture2D(uData,coord));
       }
       //根据坐标值读取噪声坐标中的噪声颜色
       vec4 colorFromIj(vec2 ij){
           vec2 coord;
           float noiseWidth,noiseHeight;
           noiseWidth = 512.0;
           noiseHeight = 512.0;
           coord = vec2(1.0/noiseWidth*(ij.x+0.5), 1.0/noiseHeight*(ij.y+0.5));//ij对应的噪声坐标
           return texture2D(uSampler,coord);
       }
      //根据定点属性索引位置，计算对应的lic颜色值
      //耦合成分：uniform值：uWidth，uHeight，uSampler，uData
      vec4 licColor(vec2 ij){
          vec4 color = vec4(0.0);//用于存储最后的结果
          float colorNum = 0.0; //实际卷积长度，碰到边界或者极值会导致卷积提前终止
          const int kernelLen = 5;//卷积核长度
          vec4 data;
          data = dataFromIj(ij);
          color += colorFromIj(ij);
          colorNum += 1.0;
          vec4 pData,nData;
          pData = data;
          nData = data;
          vec2 pIj,nIj;
          pIj = ij;
          nIj = ij;
          //正向卷积
          for(int i=0;i < kernelLen;i++){
             pIj = updateIj(pIj,pData.xy);
             if(pIj.x < 0.0 || pIj.y < 0.0) break;
             if(pIj.x > uWidth - 1.0 || pIj.y > uHeight -1.0) break;//超出边界时跳出
             pData = dataFromIj(pIj);
             color += dataFromIj(pIj);
             colorNum += 1.0;
          }
          //反向卷积
          for(int i=0;i < kernelLen;i++){
             nIj = updateIj(nIj,(-1.0*nData.xy));
             if(nIj.x < 0.0 || nIj.y < 0.0) break;
             if(nIj.x > uWidth - 1.0 || nIj.y > uHeight -1.0) break;//超出边界时跳出
             nData = dataFromIj(nIj);
             color += dataFromIj(nIj);
             colorNum += 1.0;
          }
          color = color/colorNum;
          return color;
      }
      vec2 mapping(vec2 position){
          vec2 result;
          result = (position*2.0 - 1.0);
          return result;
      }
      void main(void) {
          vec2 ij;
          ij.x = floor(aVertexNumber / uWidth);
          ij.y = aVertexNumber-ij.x*uWidth;
          vColor = licColor(ij);
          vec4 data;
          data = dataFromIj(ij);//数据纹理的x，y存储方向值，z，w存储位置值
          vec2 position = data.zw;
          gl_Position = vec4(position,0.0,1.0);
      }
