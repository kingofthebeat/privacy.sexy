<template>
    <div class="privacy-policy">
      <div v-if="!isDesktop" class="line">
          <div class="line__emoji">🚫🍪</div>
          <div>No cookies!</div>
      </div>
      <div v-if="isDesktop" class="line">
          <div class="line__emoji">🚫🌐</div>
          <div>Everything is offline, except single request GitHub to check for updates on application start.</div>
      </div>
      <div class="line">
          <div class="line__emoji">🚫👀</div>
          <div>No user behavior / IP adress collection!</div>
      </div>
      <div class="line">
          <div class="line__emoji">🤖</div>
          <div>All transparent: Deployed automatically from master branch
          of the <a :href="repositoryUrl" target="_blank">source code</a> with no changes.</div>
      </div>
      <div v-if="!isDesktop" class="line">
          <div class="line__emoji">📈</div>
          <div>Basic <a href="https://aws.amazon.com/cloudfront/reporting/" target="_blank">CDN statistics</a>
          are collected by AWS but they cannot be related to you or your behavior. You can download the offline version if you don't want CDN data collection.</div>
      </div>
      <div class="line">
          <div class="line__emoji">🎉</div>
          <div>As almost no data is colected, the application gets better only with your active feedback.
          Feel free to <a :href="feedbackUrl" target="_blank">create an issue</a> 😊</div>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Environment } from '@/application/Environment/Environment';
import { ApplicationFactory } from '@/application/ApplicationFactory';
import { IApplication } from '@/domain/IApplication';

@Component
export default class PrivacyPolicy extends Vue {
  public repositoryUrl: string = '';
  public feedbackUrl: string = '';
  public isDesktop = Environment.CurrentEnvironment.isDesktop;

  public async created() {
    const app = await ApplicationFactory.Current.getAppAsync();
    this.initialize(app);
  }

  private initialize(app: IApplication) {
    const info = app.info;
    this.repositoryUrl = info.repositoryWebUrl;
    this.feedbackUrl = info.feedbackUrl;
  }
}
</script>

<style scoped lang="scss">
@import "@/presentation/styles/fonts.scss";
.privacy-policy {
    display: flex;
    flex-direction: column;
    font-family: $normal-font;
    text-align:center;

    .line {
        display: flex;
        flex-direction: column;

        &:not(:first-child) {
          margin-top:0.2rem;
        }
    }
}
</style>
