import { postman } from './utils/postman';
import {
	buildFreemiusQueryFromOptions,
	generateUID,
	getIsFlashingBrowser,
	isExitAttempt,
	MAX_ZINDEX,
} from './utils/ops';
import { Logger } from './utils/logger';

export {
	buildFreemiusQueryFromOptions,
	generateUID,
	getIsFlashingBrowser,
	isExitAttempt,
	MAX_ZINDEX,
	Logger,
	postman,
};
import type { PostmanEvents } from './utils/postman';
export type { PostmanEvents };

export interface CheckoutOptions {
	/**
	 * Required product ID (whether it’s a plugin, theme, add-on, bundle, or SaaS).
	 */
	plugin_id: number | string;
	/**
	 * Require product public key.
	 */
	public_key: string;
	/**
	 * An optional ID to set the id attribute of the checkout’s <body> HTML element.
	 * This argument is particularly useful if you have multiple checkout instances
	 * that need to have a slightly different design or visibility of UI components.
	 * You can assign a unique ID for each instance and customize it differently
	 * using the CSS stylesheet that you can attach through the
	 * PLANS -> CUSTOMIZATION in the Developer Dashboard.
	 */
	id?: string;
	/**
	 * An optional string to override the product’s title.
	 *
	 * @default "Defaults to the product’s title set within the Freemius dashboard."
	 */
	name?: string;
	/**
	 * An optional string to override the checkout’s title when buying a new license.
	 *
	 * @default "Great selection, {{ firstName }}!"
	 */
	title?: string;
	/**
	 * An optional string to override the checkout’s subtitle.
	 *
	 * @default "You’re one step closer to our {{ planTitle }} features"
	 */
	subtitle?: string;
	/**
	 * An optional icon that loads at the checkout and will override the product’s
	 * icon uploaded to the Freemius Dashboard. Use a secure path to the image
	 * over HTTPS. While the checkout will remain PCI compliant,
	 * credit-card automatic prefill by the browser will not work.
	 *
	 * @default "product's image set within the Freemius dashboard"
	 */
	image?: string;
	/**
	 * The ID of the plan that will load with the checkout. When selling multiple
	 * plans you can set the param when calling the open() method.
	 *
	 * @default "1st paid plan"
	 */
	plan_id?: number | string;
	/**
	 * A multi-site licenses prices that will load immediately with the checkout.
	 * A developer-friendly param that can be used instead of the pricing_id.
	 * To specify unlimited licenses prices, use one of the following
	 * values: 0, null, or 'unlimited'.
	 *
	 * @default 1
	 */
	licenses?: number;
	/**
	 * Set this param to true if you like to disable the licenses selector when
	 * the product is sold with multiple license activation options.
	 *
	 * @default false
	 */
	disable_licenses_selector?: boolean;
	/**
	 * Use the `licenses` param instead. An optional ID of the exact multi-site
	 * license prices that will load once the checkout opened.
	 *
	 * @default "plan’s single-site prices ID"
	 */
	pricing_id?: number | string;
	/**
	 * An optional billing cycle that will be auto selected when the checkout is opened.
	 * Can be one of the following values: 'monthly', 'annual', 'lifetime'.
	 *
	 * @default 'annual'
	 */
	billing_cycle?: 'monthly' | 'annual' | 'lifetime';
	/**
	 * Set this param to `true` if you like to hide the billing cycles selector
	 * when the product is sold in multiple billing frequencies.
	 *
	 * @default false
	 */
	hide_billing_cycles?: boolean;
	/**
	 * One of the following 3-chars currency codes (ISO 4217): 'usd', 'eur', 'gbp'.
	 *
	 * @default 'usd'
	 */
	currency?: 'usd' | 'eur' | 'gbp';
	/**
	 * An optional coupon code to be automatically applied on the checkout
	 * immediately when opened.
	 */
	coupon?: string;
	/**
	 * Set this param to true if you pre-populate a coupon and like to hide the
	 * coupon code and coupon input field from the user.
	 *
	 * @default false
	 */
	hide_coupon?: boolean;
	/**
	 * Set this param to false when selling a bundle and you want the discounts
	 * to be based on the closest licenses quota and billing cycle from the child
	 * products. Unlike the default discounts calculation which is maximized by
	 * basing the discounts on the child products single-site prices.
	 *
	 * @default true
	 */
	maximize_discounts?: boolean;
	/**
	 * When set to true, it will open the checkout in a trial mode and the trial
	 * type (free vs. paid) will be based on the plan’s configuration. This will
	 * only work if you’ve activated the Free Trial functionality in the plan
	 * configuration. If you configured the plan to support a trial that doesn’t
	 * require a payment method, you can also open the checkout in a trial mode
	 * that requires a payment method by setting the value to 'paid'.
	 *
	 * @default false
	 */
	trial?: boolean | 'free' | 'paid';
	/**
	 * An optional param to pre-populate a license key for license renewal,
	 * license extension and more.
	 */
	license_key?: string;
	/**
	 * An optional param to load the checkout for a payment method update.
	 * When set to `true`, the license_key param must be set and associated with
	 * a non-canceled subscription.
	 *
	 * @default false
	 */
	is_payment_method_update?: boolean;
	/**
	 * An optional string to prefill the buyer’s email address.
	 */
	user_email?: string;
	/**
	 * An optional string to prefill the buyer’s first name.
	 */
	user_firstname?: string;
	/**
	 * An optional string to prefill the buyer’s last name.
	 */
	user_lastname?: string;
	/**
	 * An optional user ID to associate purchases generated through the checkout
	 * with their affiliate account.
	 */
	affiliate_user_id?: number;
	// SANDBOX
	/**
	 * If you would like the dialog to open in sandbox mode,
	 */
	sandbox?: {
		ctx: string;
		token: string;
	};
	// EVENT HANDLERS
	/**
	 * A callback handler that will execute once a user closes the checkout by
	 * clicking the close icon. This handler only executes when the checkout is
	 * running in a dialog mode.
	 */
	cancel?: () => void;
	/**
	 * An after successful purchase/subscription completion callback handler.
	 *
	 * Notice: When the user subscribes to a recurring billing plan, this method
	 * will execute upon a successful subscription creation. It doesn’t guarantee
	 * that the subscription’s initial payment was processed successfully as well.
	 */
	purchaseCompleted?: (data: Record<string, any> | null) => void;
	/**
	 * An optional callback handler, similar to purchaseCompleted. The main
	 * difference is that this callback will only execute after the user clicks
	 * the “Got It”” button that appears in the after purchase screen as a
	 * declaration that they successfully received the after purchase email.
	 * This callback is obsolete when the checkout is running in a 'dashboard' mode
	 */
	success?: (
		data: { purchase: Record<string, any> } | Record<string, any> | null
	) => void;
	/**
	 * An optional callback handler for advanced tracking, which will be called on
	 * multiple checkout events such as updates in the currency, billing cycle,
	 * licenses #, etc.
	 */
	track?: (event: string, data: Record<string, any> | null) => void;
	/**
	 * Optional callback to execute when the iFrame opens.
	 */
	afterOpen?: () => void;
	/**
	 * An optional callback to execute when the iFrame closes.
	 */
	afterClose?: () => void;
	/**
	 * Optional callback to trigger on exit intent. This is called only when the
	 * checkout iFrame is shown, not on global exit intent.
	 */
	onExitIntent?: () => void;
}

export class FSCheckout {
	private options: CheckoutOptions = { plugin_id: 0, public_key: '' };

	private iFrame: HTMLIFrameElement | null = null;

	private loader: HTMLDivElement | null = null;

	private exitIntentDiv: HTMLDivElement | null = null;

	private style: HTMLStyleElement | null = null;

	private guid: string;

	private baseUrl: string = 'https://checkout.freemius.com';

	private overflow: { x: number; y: number } = { x: 0, y: 0 };

	readonly loaderId: string;

	readonly exitIntentId: string;

	readonly iFrameId: string;

	readonly bodyClassOpen: string;

	readonly isFlashingBrowser: boolean;

	private iFramePostman: PostmanEvents | null = null;

	private isOpen: boolean = false;

	private clearExitIntentListener: (() => void) | null = null;

	private prepareLoader() {
		this.loader!.id = this.loaderId;
		this.loader!.innerHTML = `<img src="${this.baseUrl}/assets/img/spinner.svg" alt="Loading Freemius Checkout" />`;
		document.body.appendChild(this.loader!);
	}

	private prepareStyle() {
		const styleContent = `
#${this.loaderId} {
	display: none;
	position: fixed;
	z-index: ${MAX_ZINDEX - 1};
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	text-align: left;
	background: rgba(0, 0, 0, 0.6);
	transition: opacity 200ms ease-out;
	will-change: opacity;
	opacity: 0;
}
#${this.loaderId}.show {
	opacity: 1;
	display: block;
}
#${this.loaderId} img {
	position: absolute;
	top: 40%;
	left: 50%;
	width: auto;
	height: auto;
	margin-left: -25px;
	background: #fff;
	padding: 10px;
	border-radius: 50%;
	box-shadow: 2px 2px 2px rgba(0,0,0,0.1);
}
body.${this.bodyClassOpen} {
	overflow: hidden;
}
#${this.exitIntentId} {
	z-index: ${MAX_ZINDEX};
	border: 0;
	background: transparent;
	position: fixed;
	padding: 0;
	margin: 0;
	height: 10px;
	left: 0;
	right: 0;
	width: 100%;
	top: 0;
}
#${this.iFrameId} {
	z-index: ${MAX_ZINDEX - 1};
	background: rgba(0,0,0,0.003);
	border: 0 none transparent;
	visibility: ${this.isFlashingBrowser ? 'hidden' : 'visible'};
	margin: 0;
	padding: 0;
	position: fixed;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	-webkit-tap-highlight-color: transparent;
	overflow: hidden;
}
#${this.iFrameId}.show {
	visibility: visible;
}
		`;
		this.style!.setAttribute('type', 'text/css');
		this.style!.textContent = styleContent;
		document.head.appendChild(this.style!);
	}

	private isSsr() {
		return typeof window === 'undefined';
	}

	private prepareIFrame() {
		const {
			plugin_id,
			public_key,
			affiliate_user_id,
			billing_cycle,
			coupon,
			currency,
			disable_licenses_selector,
			hide_billing_cycles,
			hide_coupon,
			id,
			image,
			is_payment_method_update,
			license_key,
			licenses,
			maximize_discounts,
			name,
			plan_id,
			pricing_id,
			sandbox,
			title,
			trial,
			user_email,
			user_firstname,
			user_lastname,
		} = this.options;
		const queryParams: Record<string, any> = {
			plugin_id,
			public_key,
			affiliate_user_id,
			billing_cycle,
			coupon,
			currency,
			disable_licenses_selector,
			hide_billing_cycles,
			hide_coupon,
			id,
			image,
			is_payment_method_update,
			license_key,
			licenses,
			maximize_discounts,
			name,
			plan_id,
			pricing_id,
			title,
			trial,
			user_email,
			user_firstname,
			user_lastname,
			mode: 'dialog',
			guid: this.guid,
		};
		if (sandbox && sandbox.ctx && sandbox.token) {
			queryParams.s_ctx_ts = sandbox.ctx;
			queryParams.sandbox = sandbox.token;
		}
		// add the iFrame
		const src = `${this.baseUrl}/?${buildFreemiusQueryFromOptions(
			queryParams
		)}#${encodeURIComponent(document.location.href)}`;
		this.iFrame = document.createElement('iframe');
		this.iFrame.id = this.iFrameId;
		this.iFrame.src = src;
		this.iFrame.setAttribute('width', '100%');
		this.iFrame.setAttribute('height', '100%');
		this.iFrame.setAttribute('allowtransparency', 'true');
		this.iFrame.setAttribute('frameborder', '0');
		document.body.appendChild(this.iFrame);
		this.iFramePostman = postman(this.iFrame, this.baseUrl);
	}

	private attachPostMessageListeners() {
		this.iFramePostman?.one(
			'upgraded',
			data => {
				try {
					this.options.success?.(data as any);
				} catch (e) {
					Logger.Error(e);
				}
				this.closeCheckoutPopup();
			},
			true
		);
		this.iFramePostman?.one(
			'purchaseCompleted',
			data => {
				try {
					this.options.purchaseCompleted?.(data as any);
				} catch (e) {
					Logger.Error(e);
				}
			},
			true
		);
		this.iFramePostman?.one(
			'canceled',
			() => {
				try {
					this.options.cancel?.();
				} catch (e) {
					Logger.Error(e);
				}
				this.closeCheckoutPopup();
			},
			true
		);
		this.iFramePostman?.on('track', data => {
			try {
				this.options.track?.((data as any).event, data as any);
			} catch (e) {
				Logger.Error(e);
			}
		});
		this.iFramePostman?.one(
			'loaded',
			() => {
				// hide the loader
				this.loader?.classList.remove('show');
				if (this.isFlashingBrowser) {
					if (this.iFrame?.contentWindow?.document.readyState === 'complete') {
						this.iFrame.classList.add('show');
					} else {
						this.iFrame?.addEventListener('load', () => {
							this.iFrame?.classList.add('show');
						});
					}
				}
				// call the afterOpen handler
				try {
					this.options.afterOpen?.();
				} catch (e) {
					Logger.Error(e);
				}
			},
			true
		);
	}

	private initExitIntent() {
		// add the exitIntent Div
		this.exitIntentDiv = document.createElement('div');
		this.exitIntentDiv.id = this.exitIntentId;
		document.body.appendChild(this.exitIntentDiv);

		const html = document.documentElement;
		let delayTimer: number | null = null;
		const delay = 300;

		const mouseLeaveHandler = (event: MouseEvent) => {
			if (!isExitAttempt(event)) {
				return;
			}
			delayTimer = setTimeout(() => {
				this.iFramePostman?.post('exit_intent', null);
				try {
					this.options.onExitIntent?.();
				} catch (e) {
					Logger.Error(e);
				}
			}, delay);
		};
		const mouseEnterHandler = () => {
			if (delayTimer) {
				clearTimeout(delayTimer);
				delayTimer = null;
			}
		};
		html.addEventListener('mouseleave', mouseLeaveHandler);
		html.addEventListener('mouseenter', mouseEnterHandler);
		this.clearExitIntentListener = () => {
			if (delayTimer) {
				clearTimeout(delayTimer);
				delayTimer = null;
			}
			html.removeEventListener('mouseleave', mouseLeaveHandler);
			html.removeEventListener('mouseenter', mouseEnterHandler);
		};
	}

	private removeExitIntent() {
		this.exitIntentDiv?.remove();
		this.exitIntentDiv = null;
		this.clearExitIntentListener?.();
	}

	private closeIFramePopup() {
		if (!this.isOpen) {
			return;
		}
		// hide the loader
		this.loader?.classList.remove('show');
		// restore document overflow
		document.documentElement.scrollTop = this.overflow.x;
		document.documentElement.scrollLeft = this.overflow.y;
		// remove body scrolling override
		document.body.classList.remove(this.bodyClassOpen);

		if (this.options.afterClose) {
			try {
				this.options.afterClose();
			} catch (e) {
				Logger.Error(e);
			}
		}

		this.isOpen = false;
	}

	private closeCheckoutPopup() {
		// remove the iFrame
		this.iFramePostman?.destroy();
		this.iFrame?.remove();
		this.closeIFramePopup();
		this.removeExitIntent();
	}

	constructor(options: CheckoutOptions) {
		if (!options.plugin_id) {
			throw new Error('Must provide a plugin_id to options.');
		}
		if (!options.public_key) {
			throw new Error('Must provide the public_key to options.');
		}
		this.options = options;
		this.guid = generateUID();
		this.loaderId = `fs-loader-${this.guid}`;
		this.bodyClassOpen = `is-fs-checkout-open-${this.guid}`;
		this.exitIntentId = `fs-exit-intent-${this.guid}`;
		this.iFrameId = `fs-checkout-page-${this.guid}`;
		this.isFlashingBrowser = getIsFlashingBrowser();

		// if window is present, i.e, not SSR, then create the needed DOMs
		if (!this.isSsr()) {
			this.loader = document.createElement('div');
			this.style = document.createElement('style');
			// prepare all DOM elements
			this.prepareStyle();
			this.prepareLoader();
		}
	}

	/**
	 * Open the Checkout Popup. You can pass additional options to the function
	 * and it will override the previously set options.
	 */
	public open(options?: Omit<CheckoutOptions, 'plugin_id' | 'public_key'>) {
		if (this.isSsr()) {
			return;
		}
		// if this is already open, then cancel
		if (this.isOpen) {
			Logger.Warn(
				'Checkout popup already open. Please close it first before opening it again.'
			);
			return;
		}
		// override options
		if (options) {
			this.options = { ...this.options, ...options };
		}

		// show the loader
		this.loader?.classList.add('show');
		// get and store the current overflow position
		this.overflow = {
			x: document.documentElement.scrollTop,
			y: document.documentElement.scrollLeft,
		};
		// hide body scrolling
		document.body.classList.add(this.bodyClassOpen);

		// add the iFrame
		this.prepareIFrame();
		// attach postMessage receiver to the iFrame
		this.attachPostMessageListeners();
		// init exit intent
		this.initExitIntent();

		this.isOpen = true;
	}

	/**
	 * Programmatically close the checkout popup.
	 */
	public close() {
		if (this.isSsr()) {
			return;
		}
		// send the close signal to the iframe which will trigger the needed events
		this.iFramePostman?.post('close', null);
	}

	public destroy() {
		this.close();
		// remove style
		this.style?.remove();
		// remove loader
		this.loader?.remove();
	}

	public getGuid() {
		return this.guid;
	}
}
