FROM nginx:1.15.8

ENV TZ America/Toronto

RUN chgrp nginx /var/cache/nginx/
RUN chmod -R g+w /var/cache/nginx/

RUN sed --regexp-extended --in-place=.bak 's%(^\s+listen\s+)80(;)%\17070\2%' /etc/nginx/conf.d/default.conf
EXPOSE 7070

RUN sed --regexp-extended --in-place=.bak 's%^pid\s+/var/run/nginx.pid;%pid /var/tmp/nginx.pid;%' /etc/nginx/nginx.conf

USER nginx