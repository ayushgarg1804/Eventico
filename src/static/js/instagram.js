themeInstagram = (function() {
    function themeInstagram(container, data) {
      var pattern, renderTemplate, storageObj, storageTime, url;
      url = 'https://api.instagram.com/v1';
      pattern = function(obj) {
        var item, k, len, template;
        if (obj.length) {
          template = '';
          for (k = 0, len = obj.length; k < len; k++) {
            item = obj[k];
            template += "<li class='text-center'><a href='" + item.link + "' title='" + item.title + "' target='_blank'><img src='" + item.image + "' alt='" + item.title + "' width='150' height='150'></a></li>";
          }
          return container.append(template);
        }
      };
      if (container.data('instagram-username')) {
        url += "/users/search?q=" + (container.data('instagram-username')) + "&client_id=" + data.clientID + "&callback=?";
        renderTemplate = this._template;
        storageTime = new Date().getTime();
        if (localStorage.getItem('instagramFeed')) {
          storageObj = JSON.parse(localStorage.getItem('instagramFeed'));
          storageTime = new Date().getTime() - storageObj.timestamp;
          if (storageTime < 99999) {
            pattern(storageObj.data);
          }
        }
        if (storageTime > 99999) {
          localStorage.removeItem('instagramFeed');
          $.ajax({
            dataType: "jsonp",
            url: url,
            data: data,
            success: function(response) {
              var urlUser;
              if (response.data.length) {
                urlUser = "https://api.instagram.com/v1/users/" + response.data[0].id + "/media/recent/?client_id=" + data.clientID + "&count=" + data.count + "&callback=?";
                return $.ajax({
                  dataType: "jsonp",
                  url: urlUser,
                  data: data,
                  success: function(response) {
                    var instagramFeed;
                    if (response.data.length) {
                      instagramFeed = {};
                      instagramFeed.data = renderTemplate(response);
                      instagramFeed.timestamp = new Date().getTime();
                      localStorage.setItem('instagramFeed', JSON.stringify(instagramFeed));
                      return pattern(instagramFeed.data);
                    }
                  }
                });
              }
            }
          });
        }
      }
    }

    themeInstagram.prototype._template = function(obj) {
      var item, k, len, ref, results;
      if (obj.data) {
        ref = obj.data;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          item = ref[k];
          results.push({
            title: item.user.username,
            link: item.link,
            image: item.images.thumbnail.url
          });
        }
        return results;
      }
    };

    return themeInstagram;

  })();

  if ($('[data-instagram]').length) {
    iContainer = $('[data-instagram]');
    teslaInstagram = new themeInstagram(iContainer, {
      clientID: '632fb01c8c0d43d7b63da809d0b6a662',
      count: iContainer.data('instagram') || 6
    });
  }