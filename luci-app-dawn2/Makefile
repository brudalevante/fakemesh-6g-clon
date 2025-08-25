include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-dawn2
PKG_VERSION:=1.0.0
PKG_RELEASE:=1

PKG_LICENSE:=GPLv3
PKG_MAINTAINER:=brudalevante

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
  CATEGORY:=Network
  SUBMENU:=Mesh
  TITLE:=LuCI Support for dawn
  PKGARCH:=all
  DEPENDS:=+jsonfilter +umdns +firewall4
endef

define Package/$(PKG_NAME)/description
LuCI Support for dawn (6G/7G ready).
endef

define Build/Configure
endef

define Build/Compile
endef

define Package/$(PKG_NAME)/install
	# Configuración UCI
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) $(CURDIR)/root/etc/config/dawn $(1)/etc/config/dawn

	# Menú LuCI
	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DATA) $(CURDIR)/root/luci/menu.d/luci-app-dawn.json $(1)/usr/share/luci/menu.d/luci-app-dawn2.json

	# ACL RPCD
	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d
	$(INSTALL_DATA) $(CURDIR)/root/luci/rcpd/acl.d/luci-app-dawn.json $(1)/usr/share/rpcd/acl.d/luci-app-dawn2.json

	# JS común
	$(INSTALL_DIR) $(1)/www/luci-static/resources/dawn
	$(INSTALL_DATA) $(CURDIR)/root/htdocs/luci-static/resources/dawn/dawn-common.js $(1)/www/luci-static/resources/dawn/dawn-common.js

	# Vistas JS - network
	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/network
	$(INSTALL_DATA) $(CURDIR)/root/htdocs/luci-static/resources/view/network/dawn.js $(1)/www/luci-static/resources/view/network/dawn.js

	# Vistas JS - status/dawn
	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/status/dawn
	$(INSTALL_DATA) $(CURDIR)/root/htdocs/luci-static/resources/view/status/dawn/hearing_map.js $(1)/www/luci-static/resources/view/status/dawn/hearing_map.js
	$(INSTALL_DATA) $(CURDIR)/root/htdocs/luci-static/resources/view/status/dawn/network_overview.js $(1)/www/luci-static/resources/view/status/dawn/network_overview.js
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
