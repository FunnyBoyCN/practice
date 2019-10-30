<template>
    <div class="notFoundView">
        <div class="header">
            <div>无法找到该页面</div>
        </div>
        <div class="number"><h1>404</h1></div>
        <div class="op" ref="op">
            <button @click.stop="$router.push('/')">回到主页</button>
            <button ><a class="connect" href="tel:186-8977-2300">联系我们</a></button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
      .notFoundView{
          width: 375px;
          height: 100vh;
          font-size: 25px;
          font-family: 'Cabin Sketch', cursive;
          color: whitesmoke;
          .header{
              height: 15vh;
              background-color: #F44336;
              width: 375px;
              @include radius(0 0 60% 60%);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
          }
          .number{
              position: fixed;
              top:50%;
              left:50%;
              width: 120px;
              height: 120px;
              margin-left: -60px;
              margin-top: -60px;
              background-color: #F44336;
              @include radius(50%);
              text-align: center;
              line-height: 120px;
              box-shadow: 0 0 10px gray;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
          }
          .op {
              position: fixed;
              bottom: 0;
              width: 375px;
              height: 55PX;
              display: flex;
              flex-direction: row;
              @include radius(30% 30% 0 0);
              background-color: $main-color;
              overflow: hidden;
              button {
                  @include reloadButton;
                  background-color: $main-color;
                  font-size: 20px;
                  transition: all .5s;
                  flex-grow: 1;
                  .connect {
                      text-decoration: none;
                      color: whitesmoke;
                  }
                  position: relative;
              }
              button:first-child {
                  border-right: 1px dashed white;
              }
              button:active{
                  top: 2px;
              }
          }

      }
</style>