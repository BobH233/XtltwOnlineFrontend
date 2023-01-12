<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false">
        <template #header>
          <n-icon size="30" color="rgb(68, 161, 255)">
            <UpCircleFilled />
          </n-icon>
          更新日志
        </template>
        查看进步的每一点滴
      </n-card>
      <n-card :bordered="false">
        <n-timeline>
          <n-timeline-item
            v-for="timelineItem in TimelineItems"
            :type="timelineItem.type"
            :title="timelineItem.title"
            :content="timelineItem.content"
            :time="timelineItem.time"
            :key="timelineItem._id"
          />
        </n-timeline>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { UpCircleFilled } from '@vicons/antd';

  const { changeLog } = __APP_INFO__;
  const TimelineItems: any = [];
  const ChangeLogObj = JSON.parse(changeLog);
  for (let i = ChangeLogObj.length - 1; i >= 0; i--) {
    TimelineItems.push({
      type: 'info',
      title: ChangeLogObj[i].version,
      content: ChangeLogObj[i].description,
      time: '',
      _id: i,
    });
  }
</script>

