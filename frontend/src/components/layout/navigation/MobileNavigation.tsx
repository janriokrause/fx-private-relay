import Link from "next/link";
import { useLocalization } from "@fluent/react";
import styles from "./MobileNavigation.module.scss";
import { SignUpButton } from "./SignUpButton";
import {
  Cogwheel,
  ContactIcon,
  DashboardIcon,
  FaqIcon,
  HomeIcon,
  NewTabIcon,
  SignOutIcon,
  SupportIcon,
  MaskIcon,
  PhoneIcon,
} from "../../Icons";
import { useRuntimeData } from "../../../hooks/api/runtimeData";
import { getRuntimeConfig } from "../../../config";
import { getCsrfToken } from "../../../functions/cookies";
import { isFlagActive } from "../../../functions/waffle";
import { useRouter } from "next/router";

export type MenuItem = {
  url: string;
  isVisible?: boolean;
  icon: JSX.Element;
  l10n: string;
};

export type Props = {
  mobileMenuExpanded: boolean | undefined;
  hasPremium: boolean;
  isLoggedIn: boolean;
  userEmail: string | undefined;
  userAvatar: string | undefined;
};

export const MobileNavigation = (props: Props) => {
  const { mobileMenuExpanded, hasPremium, isLoggedIn, userEmail, userAvatar } =
    props;
  const { l10n } = useLocalization();
  const runtimeData = useRuntimeData();
  const { supportUrl } = getRuntimeConfig();
  const router = useRouter();

  const homePath = isLoggedIn ? "/accounts/profile" : "/";
  const phonePath = isLoggedIn ? "/phone" : "/";

  const renderMenuItem = (item: MenuItem) => {
    const { isVisible = true } = item;

    return isVisible ? (
      <li className={`${styles["menu-item"]}`}>
        <Link href={item.url}>
          <a className={`${styles.link}`}>
            {item.icon}
            {l10n.getString(item.l10n)}
          </a>
        </Link>
      </li>
    ) : null;
  };

  // We make sure toggle state is not undefined
  // or we get a flash of the mobile menu on page load.
  const toggleMenuStateClass =
    typeof mobileMenuExpanded !== "boolean"
      ? ""
      : mobileMenuExpanded
      ? styles["is-active"]
      : styles["not-active"];

  return (
    <>
      {/* Email and Phone Duo Header on Mobile */}
      {isLoggedIn && isFlagActive(runtimeData.data, "phones") ? (
        <nav
          className={`${styles["nav-mask-phone"]} ${styles["hidden-desktop"]}`}
        >
          {/* Email Mask Btn */}
          <Link href={homePath}>
            <a
              className={`${styles["nav-mask-phone-icon"]} ${
                router.pathname === "/accounts/profile"
                  ? styles["is-active"]
                  : null
              }`}
              title={l10n.getString("nav-duo-email-mask-alt")}
            >
              <MaskIcon
                width={25}
                height={25}
                alt={l10n.getString("nav-duo-phone-mask-alt")}
              />
            </a>
          </Link>
          {/* Phone Mask Btn */}
          <Link href={phonePath}>
            <a
              className={`${styles["nav-mask-phone-icon"]} ${
                router.pathname === "/phone" ? styles["is-active"] : null
              }`}
              title={l10n.getString("nav-duo-phone-mask-alt")}
            >
              <span className={styles["phone-icon-new-wrapper"]}>
                <PhoneIcon
                  width={30}
                  height={30}
                  alt={l10n.getString("nav-duo-phone-mask-alt")}
                  viewBox="0 0 20 25"
                />
                <p>{l10n.getString("phone-dashboard-header-new")}</p>
              </span>
            </a>
          </Link>
        </nav>
      ) : null}

      <nav
        aria-label={l10n.getString("nav-menu-mobile")}
        className={`${styles["mobile-menu"]}`}
      >
        {/* Below we have conditional rendering of menu items  */}
        <ul
          id={`${styles["mobile-menu"]}`}
          className={`${styles["menu-item-list"]} ${toggleMenuStateClass}`}
        >
          {isLoggedIn && (
            <li className={`${styles["menu-item"]} ${styles["user-info"]}`}>
              <img
                src={userAvatar ?? ""}
                alt=""
                className={styles["user-avatar"]}
                width={42}
                height={42}
              />
              <span>
                <b className={styles["user-email"]}>{userEmail ?? ""}</b>
                <a
                  href={`${runtimeData?.data?.FXA_ORIGIN}/settings/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles["settings-link"]}
                >
                  {l10n.getString("nav-profile-manage-fxa")}
                  <NewTabIcon
                    width={12}
                    height={18}
                    viewBox="0 0 16 18"
                    alt=""
                  />
                </a>
              </span>
            </li>
          )}

          {renderMenuItem({
            url: "/",
            isVisible: !isLoggedIn,
            icon: <HomeIcon width={20} height={20} alt="" />,
            l10n: "nav-home",
          })}

          {renderMenuItem({
            url: "/accounts/profile",
            isVisible: isLoggedIn,
            icon: <DashboardIcon width={20} height={20} alt="" />,
            l10n: "nav-dashboard",
          })}

          {/* omitting condition as this should always be visible */}
          {renderMenuItem({
            url: "/faq",
            icon: <FaqIcon width={20} height={20} alt="" />,
            l10n: "nav-faq",
          })}

          {!isLoggedIn && (
            <li
              className={`${styles["menu-item"]} ${styles["sign-up-menu-item"]}`}
            >
              <SignUpButton className={`${styles["sign-up-button"]}`} />
            </li>
          )}

          {renderMenuItem({
            url: "/accounts/settings",
            isVisible: isLoggedIn,
            icon: <Cogwheel width={20} height={20} alt="" />,
            l10n: "nav-settings",
          })}

          {renderMenuItem({
            url: `${runtimeData?.data?.FXA_ORIGIN}/support/?utm_source=${
              getRuntimeConfig().frontendOrigin
            }`,
            isVisible: isLoggedIn && hasPremium,
            icon: <ContactIcon width={20} height={20} alt="" />,
            l10n: "nav-contact",
          })}

          {renderMenuItem({
            url: `${supportUrl}?utm_source=${
              getRuntimeConfig().frontendOrigin
            }`,
            isVisible: isLoggedIn,
            icon: <SupportIcon width={20} height={20} alt="" />,
            l10n: "nav-support",
          })}

          {isLoggedIn && (
            <li className={`${styles["menu-item"]}`}>
              <form method="POST" action={getRuntimeConfig().fxaLogoutUrl}>
                <input
                  type="hidden"
                  name="csrfmiddlewaretoken"
                  value={getCsrfToken()}
                />
                <button className={`${styles.link}`} type="submit">
                  <SignOutIcon width={20} height={20} alt="" />
                  {l10n.getString("nav-sign-out")}
                </button>
              </form>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};
