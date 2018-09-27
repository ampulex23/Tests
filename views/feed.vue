<div class="wrap">
    <el-card v-for="f in fotos">
        <div slot="header">
            <h4>{{ f.title}}</h4>
        </div>
        <div class="imgWrap">
            <img :src="'https://farm' + f.farm + '.staticflickr.com/' + f.server + '/' + f.id + '_' + f.secret + '.jpg'">
        </div>
    </el-card>
</div>