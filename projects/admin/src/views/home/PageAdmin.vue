<script setup lang="ts">
import { IConfigDto } from 'shared/types/dto/config.interface';
import { SysConfig } from 'shared/types/enum/config.enum';

const loading = ref(false)
const appCfg=ref<IConfigDto[SysConfig.APP]>()
const homeCfg=ref<IConfigDto[SysConfig.HOME]>()
const articleCfg=ref<IConfigDto[SysConfig.ARTICLE]>()
const aboutCfg=ref<IConfigDto[SysConfig.ABOUT]>()

/**获取数据 */
async function getConfigList() {
  loading.value=true
  try {
    const arr=[]
    for (const o in SysConfig) {
      const data = await getConfigApi((SysConfig as any)[o])
      arr.push(data)
    }
    appCfg.value=arr[0] as IConfigDto[SysConfig.APP]
    homeCfg.value=arr[1] as IConfigDto[SysConfig.HOME]
    articleCfg.value=arr[2] as IConfigDto[SysConfig.ARTICLE]
    aboutCfg.value = arr[3] as IConfigDto[SysConfig.ABOUT]
  } catch (error) {}
  finally {
    loading.value=false
  }
}

/** */
async function save(val:SysConfig) {
  console.log(val);
}

onMounted(() => {
  getConfigList()
})
</script>

<template>
  <div full flex="~ col gap-6" overflow-auto>
    <ZLoading :value="loading" />

    <div flex="~ col gap-4">
      <div flex justify-between>
        <h3>APP设置</h3>
        <ZBtn min-w-20 label="保存" @click="save(SysConfig.APP)"/>
      </div>
      <div v-if="appCfg" flex="~ col gap1">
        <div v-text="'名称'"/>
        <ZInput flex-1 v-model="appCfg.name"
          placeholder="输入APP名称"
        size="medium" />
      </div>
      <div flex="~ col">
        <div flex justify-between>
          <div>LOGO</div>
          <ZUpload>
            <ZBtn label="上传图片">
              <template #left>
                <div i-mdi:file-image-outline />
              </template>
            </ZBtn>
          </ZUpload>
        </div>
        <div
          w-55 h-30 b-rd-5
          border="1px gray-4"
          overflow-hidden
          >
          <img full :src="appCfg?.icon" alt="">
        </div>
      </div>
    </div>

    <div flex="~ col gap-4">
      <div flex justify-between>
        <h3>首页设置</h3>
        <ZBtn min-w-20 label="保存" @click="save(SysConfig.HOME)" />
      </div>
      <div v-if="homeCfg" flex="~ col gap1">
        <div v-text="'标题'"/>
        <ZInput flex-1 v-model="homeCfg.title"
          placeholder="输入首页标题"
        size="medium" />
      </div>
      <div v-if="homeCfg" flex="~ col gap1">
        <div v-text="'副标题'"/>
        <ZInput flex-1 v-model="homeCfg.label"
          placeholder="输入首页副标题"
        size="medium" />
      </div>
      <div flex="~ col">
        <div flex justify-between>
          <div>背景图片</div>
          <ZUpload >
            <ZBtn label="上传图片">
              <template #left>
                <div i-mdi:file-image-outline />
              </template>
            </ZBtn>
          </ZUpload>
        </div>
        <div
          w-55 h-30 b-rd-5
          border="1px gray-4"
          overflow-hidden
          >
          <img full :src="homeCfg?.url" alt="">
        </div>
      </div>
    </div>

    <div flex="~ col gap-4">
      <div flex justify-between>
        <h3>文章页设置</h3>
        <ZBtn min-w-20 label="保存" @click="save(SysConfig.ARTICLE)" />
      </div>
      <div v-if="articleCfg" flex="~ col gap1">
        <div v-text="'标题'"/>
        <ZInput flex-1 v-model="articleCfg.title"
          placeholder="输入文章页标题"
        size="medium" />
      </div>
      <div v-if="articleCfg" flex="~ col gap1">
        <div v-text="'副标题'"/>
        <ZInput flex-1 v-model="articleCfg.label"
          placeholder="输入文章页副标题"
        size="medium" />
      </div>
      <div flex="~ col">
        <div flex justify-between>
          <div>背景图片</div>
          <ZUpload >
            <ZBtn label="上传图片">
              <template #left>
                <div i-mdi:file-image-outline />
              </template>
            </ZBtn>
          </ZUpload>
        </div>
        <div
          w-55 h-30 b-rd-5
          border="1px gray-4"
          overflow-hidden
          >
          <img full :src="articleCfg?.url" alt="">
        </div>
      </div>
    </div>

    <div flex="~ col gap-4">
      <div flex justify-between>
        <h3>关于页面设置</h3>
        <ZBtn min-w-20 label="保存" @click="save(SysConfig.ABOUT)" />
      </div>
      <div v-if="aboutCfg" flex="~ col gap1">
        <div v-text="'标题'"/>
        <ZInput flex-1 v-model="aboutCfg.title"
          placeholder="输入关于页标题"
        size="medium" />
      </div>
      <div v-if="aboutCfg" flex="~ col gap1">
        <div v-text="'副标题'"/>
        <ZInput flex-1 v-model="aboutCfg.label"
          placeholder="输入关于页副标题"
        size="medium" />
      </div>
      <div flex="~ col">
        <div flex justify-between>
          <div>背景图片</div>
          <ZUpload >
            <ZBtn label="上传图片">
              <template #left>
                <div i-mdi:file-image-outline />
              </template>
            </ZBtn>
          </ZUpload>
        </div>
        <div
          w-55 h-30 b-rd-5
          border="1px gray-4"
          overflow-hidden
          >
          <img full :src="aboutCfg?.url" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
