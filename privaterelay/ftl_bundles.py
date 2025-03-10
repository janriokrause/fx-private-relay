import os.path

from django.utils.functional import cached_property

from django_ftl.bundles import Bundle, DjangoMessageFinder


class RelayMessageFinder(DjangoMessageFinder):
    @cached_property
    def locale_base_dirs(self):
        base_dirs = super().locale_base_dirs

        from django.apps import apps

        pending_dirs = []
        for app_config in apps.get_app_configs():
            if not app_config.path:
                continue
            pending_locales_dir = os.path.join(app_config.path, "pending_locales")
            if os.path.isdir(pending_locales_dir):
                pending_dirs.append(pending_locales_dir)
        return base_dirs + pending_dirs


# The django_ftl package requires the names of the Fluent files.
# Only the ones with strings used by the backend are loaded.
# See frontend/src/functions/getL10n.ts for frontend bundle setup.
# The frontend, which uses more strings, loads all files ending in .ftl.
main = Bundle(
    [
        "brands.ftl",  # Brand names, used in other messages
        "layout.ftl",  # Strings in HTML <meta> tags, etc.
        "misc.ftl",  # Error messages
        "pending.ftl",  # The backend pending translations, ./en/pending.ftl
        "phones.ftl",  # SMS errors
        "faq.ftl",  # email-size-limit
    ],
    finder=RelayMessageFinder(),
)
