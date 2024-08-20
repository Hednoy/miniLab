#state build
FROM node:20-alpine AS app

WORKDIR /app

COPY ./ .
# RUN yarn config set cache-folder /base/yarn-offline-cache && \
#     yarn config set yarn-offline-mirror /base/yarn-offline-cache

RUN yarn

ENV NODE_ENV=production

RUN yarn prisma-generate

RUN yarn build

# # state build
# FROM base AS build
# ENV NODE_ENV=production
# WORKDIR /build
# COPY --from=base /base ./
# COPY ./ .
# RUN yarn build

# #state run
# FROM base AS app
# WORKDIR /app
# COPY --from=base ./base/yarn-offline-cache ./base/yarn-offline-cache
# COPY --from=build /build/package*.json ./
# COPY --from=build /build/.next ./.next/
# COPY --from=build /build/public ./public/
# COPY --from=build /build/next.config.js ./
# RUN yarn config set cache-folder ./base/yarn-offline-cache && \
#     yarn config set yarn-offline-mirror ./base/yarn-offline-cache && \
#     yarn config set yarn-offline-mirror-pruning true && \
#     yarn config set yarn-offline-mirror-pruning-method frequency && \
#     yarn config set yarn-offline-mirror-pruning-interval 1
# RUN yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline
# RUN yarn cache clean

EXPOSE 3000
CMD ["yarn", "start"]
