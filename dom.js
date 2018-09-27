
const domain = 'https://tkgwku.github.io/n';
const MESSAGE_TYPES = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

const STAR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABe0lEQVQ4jbWSPUtcQRiFn5m7Gw1W22gKPzBZQgIhojbWaZSQSvBjN/4Fq9hIIGKqqIWdoIWVGqysbERII7sQ7UQwATWwRQJREVbEXGfmpBDCZpe7YOHAKWbmzPO+Z2bgPodmGXcfydfzpOoSXjAS/eEMWLt79TwZ7SPt4ZWlIclnEwnPGeUp8AzrRxi8O6CbHA+AJoh6yCXZjKbo4zFLoY3YCoOwBCBLF60gMOYEH35wYCMMBkMKwxGNfOf1bd5PDOsr1xKSQ7pBiit0UyGHVKCsafr/a0VjNPvP7OgU+TLB/Sa4nwT3i+BOCf6KoDOkVb4oTyYxumb44PZQ/I1QKVdEmmOy2l/7D8ochhQEVd8WROcUqu01rxCekNfD2wP2AmMvMRhQBujgbV2Aekn7Zt5gITrGpbfIpbcZj0oYLLhHDCdmB9A0Q/Eucisc6h2d/9YneOnWKcVFpPe8SgbMs+kXWBaYmr0BGvwiG36OlWTAJC11WwQ0RXvl/C8G2bIkQqHCOgAAAABJRU5ErkJggg==';
const UNSTAR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABl0lEQVQ4jZ1RMWsUQRh9726JP8DO4q4y+AtU0IBNSKloEWKIMLMDh4VNiPWyIGlSSDq5Y7/JFVG5QgVBEEVBiDYKQgpJeX0g1TW77HwpvCOXc29FXzXzvfe9730zQA2SJGnU8QBQK2i1WrsiktRpojqS5BUA4b8SZFl2jeQBgKNut7v4zwYkN4qieK6q+1EUPahLUQkR+Vx1nkUkIpsAtgB8BXABAFU1ArA3leaViLwjWQJQVc0BrKiq4XjCEwCXrLX2b8kGg0FzNBrtl2X5wzm3wwnhvb+uqk9DCI+cc9+rmnu93tVms7lL8qEx5icAcFqQJMlCu91+CcBba9/OvMkqyXt5nq93Op1iUj/3C2ma5gAOQwjHFQEKAJ+mm/8wGGPJOfdtPPW29/4WAAyHwzchhDuz4nMGInKZ5C8A8N4/I3kTwEaWZdtpmgaSJ/1+/+JcA1VdU9UD7/0XVX1tjHlsjIkBHIrIB1X9WJbl2lyDRqNxn6TJ8/yutfb9pB7H8YuiKGKSDsB6xdq/4b2/MZc8W3N5+n4KbVypv8PDMtkAAAAASUVORK5CYII=';
const LARGE_STAR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAADl0lEQVRYhdWXXWgcZRSGn/PNzKaxsWk20WJWK7alYOmPf+CV4KVgSEqapJvgDyiIYG+8EMSb6IV45Z0WCr0QQSyJ2WwIothS9bIiSFNIrW2jMcEqFetfzf7MnONFdpOJ3U02u5riCx8z8/Gd932/98wMM/B/xqfD+DfVgE2QibK83giHq1t8GF+bedwFDN4UAxyg26VI0ME9+RMc2HgDQppOIAV+QLpunnrw5XMEdpKcGmYhFk3y3YYasAy9dg4zQ81QO4PlT/BAPVz1tUAYJBW7TkEi0djNWDPsGIF9Ql4tlkCERZPM1cO37gTCdrrpJCFgMRZz27izMMpD/7kB35FeEX8ZKQj89bfBt2MEegdvOiNUxWGIA0FwgMNwKjgniCrQQpe1gkTEM8BuAwl42jK0KngIUt6dsniuhjgHJe6C9PCMANgE79HEEPuB4B8WpaxQOjSDNMWlY/gLoRCrEVZm7IDrwFmICrzi9/BGeSmWpY9NvMODbKYjJqAl8cqStcGVxjyiZ7niChyUXr6I72/RxBi3q8cHbgeP2F4QxRoSLvMqIlPAHGOEPCkDLKxekOElO43Zr5iFqBVXjiiPRrnSyKNWuHGNFVELUfsFs5MUbZxnK2lJpUmA/Aj7/E2Muz3s1O2YFcFCIASLt6WckAPxQQKQBDgPmEH4mvPk6JYBLq3LAIAN47iPty3J89FuzBy13QsR+DOIXeWo18uR1apWNbBkZIwXtJO3wh0YGpuvROQgmEbkGkPSy/trcdf2InLcrVsWozdbHvE2LM0raAtE4NVGXQt80rqV2uI30HbwHEP/ioH8KPdrK3eZqyAvVGyiNoPewmP2LpsbNpAIOKxJbti9GBJcRvx5pIIJszYkaqGvYQPqcVjb4srgFhB/iqL9xBPePK8F04iEMSPLbVjzU231x3CcfZpkqri79EYU8H5E/DnOU6BL+pgBKI7yqGtmTHeSjLYurZXgHPbzN2zZdoQ/60pAjbQmS04VCS4g/izHX+1mb1kcIOjnsz9+Y5d/gdP+7HIOlkTaOzm0VgrVE5jkYv4HrHAJiz5iwTL0r1mT5WU9heVnscK3mGX5uC7x3Ah7os+x4ldYNMGUjbC91trCKA/bJFeK01h0Crt6nFurra3agqYmBuV3cLMc9XrYLwN8X6uBRD9nuMYud5EPJQdtHdWfhqo/l5FQ9JRD7iCZWoXjkKe4DnSFWV4U4d56ODYEfwM1wpRyzU0yVAAAAABJRU5ErkJggg==';
const LOOP_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEIklEQVRYhe2WT2hcVRTGv3PvPJ0OJkEXHUQXJrZRGiYoQi2CzsIiQUycJLwZNRrBZtOA0KXtLhW7srpzI120qOC8TCaFKQScCtFF6cIWJMlALEIjNCa1U9KEQfLuPcdF3ivPOJ38m509q/d499zv9+4997sHeBj/96Bd5GjXdQ8R0YsAUgAOArgFYAZApVqtXiuXyytNB+jv73/ScZxTAIatta0AQEQg2phCRCAiiMViEJHL1tqxQqHwc1MAXNc9TkSfM3NCa/0vQRG5D6GUAgAwM5gZWuvztVpttFQq1XYF0NPT82hbW9s5Y8xQLBa7P7mIQCm1AOAKgAUAMQCdAF611rZqrUFEsNZCKXVTRI56nndjxwC5XO6bqLgxBlrrS9baTwuFwtU6Kcp13RwRnWHmZ7TWYGYQ0R3f91PFYnFx2wCu6x5n5q+CPQUAX0Q+8Dzv+0bQAJBOp2PJZPKCtfbdWCwWQlzN5/NHtgUQFNwNIkoAgIgYAK/n8/mfthKPRjab/ZaZ39NawxgDpdSI53nnomNUvUTHcU4xcwLYWHYRGd2pOAAsLS19qJT6XUQQ1MUZbPrpegAawLDWGkHiL57nfb1TcQCYnp42zPyJtTYsyv2Dg4P9DQFc1z0UnvOg4s/uRjyM8fFxT2tdDU4OtNZ9DQECh9v4qJRZXV29tBeAIH6I+MXhhgAAUkQUmsxvU1NT9/aqLiLXIwAHEKmDegAHQwAi+mOv4kHcDR+Y2clkMs83ArgFbPi8iDjNUKfQq4N5Hcf5qxHATGA8IKLOZgAAeBZAuKrLnufdbgRQiezXU67rHtiNYl9fX0vk9TWlVOioM9Fx/wGoVqvXNl08wzsVz+Vy5+Px+L1sNvtxJpPpJKLDYV0BKDcEKJfLKyJyObhOoZQ60dvbm9yB+BvGmOFgFV9xHGeMmQkAlFLi+/7WVmytHWNmAICItOzbt+87bLN3EJEvAnCICBPRO0opWGsB4EKxWFyOjtf1JqlUKgupVKqdmV8IrtT2rq6ulzo6Oi7Oz8/7DxLPZrMj1tpjQdOySkTdRKQDF1wTkbfn5ubWtlwBAKjVaqNKqZvhVojIW4lEYmZgYGCw3vh0Oh0H8FnYMQFoAfAIAFhrYYx53/O8PzfnPRCgVCrVROQoEd0JIQC0K6XGs9nsguu6H0XHJ5PJk8y8P3LkASC80E4XCoWL9XS23NegNyhaa18OWy0RATPDGPPc5OTk/NDQUKvv+0tEFN+cLyJ3ReQKES2KyMmoBzRcgTCKxeJiPp8/opQaAbAc9AfhkdIAsL6+/rQxJh5tVEMzA/A4gDd93z9GRCc2z1+3COvF3Nzc9dnZ2bPd3d2/Algjoi8nJiZ+DL7dTqVSjwF4AsAKgBqAvwFYAKKUIqVU1Vp7ulKpNOt+eRjNiX8AU0QYjp7wU7cAAAAASUVORK5CYII=';
const NOT_LOOP_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAE/klEQVRYheWWTWxUVRTH/+fembZSGKILKmhMMBhMysKNH0BrTTRxYozJGO4dxMAG1FgViQlRiAs/ojEGkGhMDAYXLIhz3wytVEijDVFZqImGENviFwtSFS1gW2dR0nn3HBe8h6+vM4MYw0LPaua9c87vf+8995wH/N+NriTMGPMEEW0FcNg513tFBRhjnmXm17TWCMMQbW1t1+zfv3/isgXk8/nW9vb2lVrrLgBLAXSIyCQRjQEYnp6eHhoYGPitHjyTyYCZQURjzrkbgMvYgUKhsDibzW4HsMF7nyMiEP0VLiIQEWQyGYjIESJ6oVQqHTXGbGXm16PnIKJxZl4dBMGPf1uAMeZxItrBzPO01rOAUVIAgFIKAMDMEBEopT4VkR6lVOx3hplXxfBLCsjn8625XO497/26TCaTTn4KwBcicoqIsgBuAnCn9z4X+8biRAQAxkVkdRIOAJlmAtLwMAyhtT7EzC87576sE6KMMWsA7AGwMN6Z6NwfSsObCrDW9sbwaCUzSqkNzrlSE81MREtEZGGyPpRSIKJXAKxMB+h6WQqFwmKt9Yda62z0KARwTxAEh5vAYYx5hpl3aa1nbT8RIQzD61esWPHT6OjosWSMqpcom81uZ+Z5wIVtF5Fe59xnzeDW2i3MvDPeMQDnROQWACdFBFprENGrSNXdHAH5fL4VwIZ4FVrrr4IgePdScO/9Gyn4aufccWbe5r0HEcF7v6hYLBaaCliwYMEd3vsccLHidzWDF4vFp5NwIvo9qvbvAKBcLgda63PRzYGIPNBUgFKqK3Gvw2q1eqgZPAzD3Ul4rVa7CE/YUKJf3NZUgIgsjYtHRH4YHBz8ox7cGFMXfuDAgW/r5DyWELDMGNPSUACAjigIUX+fY9bap0Rkd+LMJwB01YNHNhH/YOYsM9/cTMAkgPgKZdMvjTFPMvObcZECmBSRrlKpdKIBHJRoCkSEWq12tqEAERmLEgPA8jRcRN5KwCeighttBI9sWZQbRDR+8ODBXxoKADAcnxcRLTHGLAMudMYUfNJ7390Ins/nc4m/3fFAAjCc9JvTisMwHGppaREAxMxQSj1sjDnNzG+n4F2VSmWkHtxau09E1ltrN58/f/4jIroduHCtlVIfJ33rTkNr7ZCI3B2N12kRuSrRVqdmZma6+vr6hhvE3uu9H1RKQSn1PjMDwNpoB0REOoIgOBP7123F3vsXE3UwC87M3Y3gke3UWsdNh4lorVIK3nsA2JeENxRQqVSOaq2HEiIAAMx8fxAE3zQiW2s3ee87o6KvEtGaWLxSqioiz6Vj6k5Da+1jADYnRyoAENFdnZ2dP4+MjMy5cj09PW3z588fUEq1R3GtcX7vPUSkWC6Xv07HzdkBY8yjzPxOrDwKjrvYjcxcttaOGWM2JuM6Ojq2MfOitOho9S9VKpUP6i12lrcx5hER2ZOY51Misg7A8977ldFIhYiAmRGG4fL+/v7vjTELiehXImpLA0Rkgog+F5HTIrKtYQ1Ya29NwgFURaTHOXfYObdKKbUJwHj0fRD7xEd4XRiGbckP1UT9XM3M99VqtY1EtKXhEYhIPl4ZgCqAbufc8fh9EAR7nXPXKqUeJKK9Sqn1/f39J6J3o5lMZgeAEwBOAhgDMA5gioimiSjMZrNnvfdzJuvFIzDGLCWiTwBM12q1Yl9f3/G08z80MsaoIAj8v5TvP2Z/An2SEK7JPoIZAAAAAElFTkSuQmCC';
const WIDEN_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFZklEQVRYhe1WXWgcVRT+zp3pZptmk9B2GxchaAzJQmhRBINg8S/YVkTfbDckFioEoQq+ak13t1j/Kr4UIywUCulCXFa21oIFqw99qXkQKXbphlisNXatIcJu2zU/c+/nw85sp5Ok8alPPS9z586Zc77znXPPPcB9uS/3WEiK/11yuZxVKBS6AHQZY5T3QSklJEVEGNz31v59EVEiQpLiOfHb8PaVUgbA9Ugk8ksmk6nI4ODgVsdxPhCRPgAagLMKeAFA97lmlJ5TF1xwPaeUmohGoxnbcZxtIrKN5CYRmQdwy+eIazlbwflt7+6TpMeSAFgPoJ3ky3Nzc6dsH4ULAC6SPA9Ae1STNJ4tH5XGfVckjc+/ERHPkfF8iohnQ5EcEJFuAFu01g/aqNO+4Br9vr29/aNYLKaDkfX19cnk5GS4paVFA1hcKfpyuRyORCLS398/XywWl7FXLpetSqXSBKATQEgp1W4rpYwxhi4LTiwW0+l02h8VksmkKhQKjxtjnhKR3zZu3Pjd2NjYTb9OIpHYTHJnpVLZUi6Xf8hmsxdEhAE7qFarNTctimSz8h+L4BFxf7KnpqZeMMZ8SDJB8sVqtRoN6mmtO0nuBDCktT6cSCSeSCaTKqjnppRumtYpd71iZSeTyVCpVHrVGDMKoEdE2gDUmpqaKkFdEZl1i7id5FaS709PTz+dy+WsIFavNo0x9M4uXboa1I+MjDSXSqVBAG+LSCfqeZ+0bXvs2LFj/wQBTExMzAD4HMBFETEAerTW7xYKhYEAiEawIqKU20DEz8TIyEhztVp9DcCbAGIA5gF8GwqFDmSz2amV2BIRTkxM/GxZ1gER+RGAJtlrjHnn5MmTz/pAePVWb0xuXugrmFC1Wn2d5H4ADwC4CeC0bduHx8fHr67k3C/ZbPaiZVmHROS8iDgAuh3HOVgoFAYAKH9higiVdwJcIOby5csxkjsAdACwAJwJh8MfZ7PZ8lrOPaMnTpy4ZFnWIQAXAIRE5GGt9UszMzOtAd1lKVAk5wH86zYYArCUUsv6wlogHMepicgN3Kaczc3Nd7T5Rgp8G+zu7p4VkXERuYp6k9pVq9VGh4eHO/8vgN27dz9E8j2ST6JevFcAfL19+/Zbrs0G0OApIADT29t7hmQGwHUAYQC7FhcXR13Dq15GJCWRSMQBHATwPIAwyT8BfNHW1nauWCySZCNoY4xSxhjl6wMCAOl0erGjo2McwGcAZlwQzwEYHR4efuQuzh81xhwC8AyAEIA/LMs6Eo/H85lMZslT9fsKVmWjDxw9enQhHo/nARwB8DsAG0D/0tJSYmhoaEMQwL59+zYbY94A8BgAS0SmlVKfRCKRU+l0ehEAUqmU12s8trGsVfolnU4vtrW1fQPgCMkigGvugBIK6tZqtQ0i4pD8G8AFy7LSPT09p32RI5VKeb1G6vGKst3Kb9AYNJzJZJZyudzpfD5/BUCPMeZSb2/vslYcj8evTU9Pf2mMOS8ik9ls9tfgZZRKpZhIJDwGAACyZ8+ehDEmhfr1mGltbf10YGDAAECxWGRfX18DVDQaldnZ2VWHlGg0KgCwms7Zs2dVpVJ5C8B+1FNx2Ca54J6E9SR3VCqVTfl8Xjz0pVJJeSONf9IB4A0mXhrvGNf8Ixhup1oAbAPQQvKGUkrZSqkZrfUc6rdYHECXa2BZBL5ULdtrUOqC9H/337Yk14mIJSK3SM7ZlmUVjTFfAXgFwCY3sgYDq63vJq6O5/SOtfvthoicsyzrJwGAvXv3hh3H6SK52V+I/tnS29NaN9ZKKa6kq7WmZVmitaZSisYYUUrRbe9aRG6GQqG/jh8/vqyY78s9l/8ALHgpReHZ3pAAAAAASUVORK5CYII=';
const NARROW_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFKUlEQVRYhe1WTWxUVRg95775gUppBUukCNaG0CYEtorGTTHBGMJP6YahpLrpVsICI0FHElOJMeJGks6qwgRsDSmBGIOkC0hIidGVGGaiUQIqbUhLZ6CVYd69x8W8V17H/iCJrvg273v33XfP9537ne9e4Ik9sf/ZJDH6zoGBAW9wcLAZQLNzzoQfjDGURJKqHg/96DhJQ1KSGIJE1wjHjTEOwGhtbe2PmUymwFQqtcH3/R6S6wFYAP4cwROAgueCWYagQXDV/pgx5suGhoZMzPf9jSQ3SlpO8j6AyQiQFgKbBfwhevCUFLJEAIsB1EvaNjY2djYWobAE4KqkYQA2pFqSC9eKUOmCdyPJRfAdyRDIhZgkwzWMpNdIrgWwwlq7KoYK7aVg0aH6+vojAOIA4itXrpwMFnpsW79+PYeHhxNLly61t27dUqFQSAJYAyBhjKmPGWOcc04BCz6AmmKx+IaktcVi8XJLS8ulw4cPz1UX81o6nTZnzpzZIOnlkZGR642NjReLxeJUsC1GUo2JykISp6amlgHYDGCHpHQul3u9u7s7/hjgsXw+v9la+7Fzrstau310dHRFsKWV/TAmYQJ/OgjP8+5IGpO0BEAzgIMTExO7/k0Q3d3d8Vwut9M5956kVgDLADwgWQRgw9r0fd+F2hVJAXBNTU1Fz/N6SV6WVAKwGsC+QqHQnk6nEwuBd3V1LZqYmNgFYD+AJpI+ye9IHmtubr6DiIxJGhM0EEaZOHny5K+JROIDkucllUiuArAvn89vmy+Irq6uRaVSKUVyP4DnADyQdCEWix3q7++/FkwL663SmIBp7c7Q/IkTJ24kk8kekhcA3AewWtKBfD6/Y2BgwKsGT6fTiVKp9KaktwE0SpoieZ7kh9ls9rdI1or6JlRAEMgMyR0/fvyPRCLxEYArABJBVlsHBwefrg4gl8s1StoK4FkABsA3yWSyp7+//+ZcjM22BaZ6kiQvGA/Uo/u1tbXlWdazkvzgHwG4Z629Oxd4MG8m4HTPDKyzs/OFcrmclvRSUAu/AOjv7e0tVi9WV1c3QvIMgNGgS+4ql8sH9uzZs7I60AgDqlbBdAB79+5dUy6XDwJ4FUCS5A2Sn7W2tl6srhcAyGQy5Xg8/hXJLIA7AGpJdvi+fyiVSj0f9htJ00k754xxzplIHyAApFKp5nK5/D6ANklxANeNMT0tLS3n5uuK2Wx2MhaLfQ7gGIARAE9J2mKtTXd2dq4LiY5imaqqdOPj40ustW9JekVSnOQNAJ+uW7fu20dpydlsdrKxsbFP0lEAN0nGAbxord0zPj6+BJWzZZrtfxTd1NTUYpKLJI2T/NkY80ldXd28mVfb0aNH/6qvrx8geQTAVQB/ArClUikRsM1KvoEKwh8lsaamZkLSWZJfGGPe3blz57lMJjNb1c9rmUym3N7e/rWkd0j2AhjcvXv3RIQBAEAMFfkIAI0xplQquba2tiu5XO77TZs2PQCA2RrPo1pHR8e1hoaG3O3bt3Xq1KkZhx8AxAJ5SdJiSVsKhcLyoaEhktTp06cBwITyjN50AIQXk5DBGde16BUMD7eaADYCWCLprjHGxIwxv1trx1C5JrWicgKiqiUgOhb9Vj0vDDL6PXraBoXtkZyUNBbzPO8n59xpANsBLA8yY6iOufz5LJgTgs7wg293SV7yPO8HApVTzPf9ZknPRPcoercMx6y1074xRrPNtdbK8zxaa2WMkXOOxhgFZ40leS+RSIz09fUVFkrmif3n9jcQAx8mizxdVwAAAABJRU5ErkJggg==';

const SEP_DEF_VAL = ' 　+';
//const IGN_DEF_VAL = '.';

const debug = true;

var y = {"とりあえず":[]};
var prevy = {"とりあえず":[]};
var searchHistory = [];
var selectedGenre = '';
var showingMenu = false;
var playlist = [];
var playlistTitleMap = {};
var playindex = -1;
var islocal = !debug && window.location.protocol === 'file:';
var deletedVideoArray = [];
var volumemap = {};
var starred = [];
var lastId = '';//checkURLValidity()
var autoplay = false;//createEmbedElem()
var skip_flag = false;//setupNiconicoIframe()
var player;//setupYoutubeIframe()
var loadedtn = [];

function cctntoggle(){
	var ls;
	$('#ccvideos .img-thumbnail').each(function(){
		if ($(this).hasClass('silent')){
			ls = $(this).attr('data-loadstatus');
			if (ls && ls === 'ready'){
				loadImg($(this));
			}
		}
		$(this).toggleClass('silent');
	});
}
function loadImg($elem){
	var srcurl = $elem.attr('data-src');
	if (srcurl){
		$elem.on('load', function(){
			if ($.inArray($(this).attr('src'), loadedtn) === -1){
				loadedtn.push($(this).attr('src'));
			}
			$(this).removeClass('loading');
		});
		$elem.attr('src', srcurl);
	}
}
function ccnew(){
	var val = $('#ccnew').val();
	localStorage.setItem('nicolist_ccnewval', val);
	if (val === 'copytoold' || val === 'movetoold'){
		$('#ccnewform').css('display', 'none');
		$('#ccoldform').css('display', 'block');
	} else {
		$('#ccnewform').css('display', 'block');
		$('#ccoldform').css('display', 'none');
	}
	if (val === 'copytoold' || val === 'copytoold'){
		$('#createcopy').text('コピー');
	} else {
		$('#createcopy').text('移動');
	}
}
function escapeREInsideBracket(str){
	return str.replace(/[\[\]\-\\\*\^]/g, function(x){
		return '\\' + x;
	})
}
function search(query) {
	var separator = escapeREInsideBracket($('#nicolist_separator').val());
	var sq = query.replace(new RegExp('['+separator+']'), '$').replace(/\$+/g, '$').replace(/\$$|^\$/g, '').split('$');
	if (sq[0] === '') {
		message('検索クエリが空です。');
		return;
	}
	var sqDesc = sq.join('」+「');
	$('#sr').html('');
	$('#sr').append($('<button>', {
		html: '<span>&times;</span>',
		'class': 'close',
		'aria-label': 'Close',
		'click': function(e){
			$('#sr').fadeOut('slow', function(){
				refreshStyle();
				$('#sr').html('');
			});
		}
	}));
	pushHistory(query);
	var count = 0;
	var mobj = {};
	var isand = $("#nicolist_and").prop('checked');
	var maxsearchcount = int($("#nicolist_msc").val());
	if (maxsearchcount === 0){
		maxsearchcount = Infinity;
	}
	var _keys = Object.keys(y);
	for (var i = 0; i < _keys.length; i++) {
		var genre = _keys[i];
		var list = y[genre];
		if ($('#nicolist_sort').prop('checked')) {
			list = reversePairList(list);
		}
		for (var l = 0; l < list.length/2; l++){
			var id = list[2*l];
			var title = list[2*l+1];
			var isMatched = true;
			if (isand){//and
				isMatched = true;
				for (var j = 0; j < sq.length; j++) {
					var m = title.match(new RegExp(sq[j], 'gi'));
					if (m == null){
						isMatched = false;
						break;
					}
				}//j
			} else {//or
				isMatched = false;
				for (var j = 0; j < sq.length; j++) {
					var m = title.match(new RegExp(sq[j], 'gi'));
					if (m){
						isMatched = true;
						break;
					}
				}//j
			}
			if (isMatched){
				count ++;
				if (count > maxsearchcount){
					$('#sr').append($('<span>', {
						text: '検索条件「'+sqDesc+'」に一致する動画が多すぎます'
					}));
					$('#sr').fadeIn();
					return;
				}
				if (!mobj.hasOwnProperty(genre)){
					mobj[genre] = [];
				}
				mobj[genre].push(id);
				mobj[genre].push(title);
			}
		}//l
	}//i
	var _mkeys = Object.keys(mobj);
	if (_mkeys.length === 0) {
		$('#sr').append($('<span>', {
			text: '検索条件「'+sqDesc+'」に一致する動画はありませんでした'
		}));
		$('#sr').fadeIn();
		return;
	}
	$('<h4>', {
		text: '「'+sqDesc+'」の検索結果'
	}).append($('<small>',{
		text: '('+count+'件の一致)',
		'class': 'text-muted ml-2'
	})).appendTo('#sr');
	for (var i = 0; i < _mkeys.length; i++) {
		var _g = _mkeys[i];
		var _l = mobj[_g];
		$('<h5>', {
			text: _g
		}).appendTo('#sr');
		for (var k = 0; k < _l.length/2; k++){
			var _id = _l[2*k];
			var _t = _l[2*k+1];
			var div = $('<div>',{
				'class': 'd-flex align-items-center flex-row'
			});

			var favIcon = createFavIcon(_id, _t);

			div.append(favIcon);

			var a = $('<a>', {
				'href': getVideoURL(_id),
				'target': '_blank',
				'data-genre' : _g,
				'data-id' : _id,
				'data-title' : _t,
				contextmenu: function(e){
					showMenu(e.pageX, e.pageY, $(this), 'search');
					return false;
				},
				'click': function(e){
					if ($('#click_action').val() !== 'official'){
						e.preventDefault();
					}
					openVideo($(this), 'search');
				}
			});
			var startLazyLoad = Math.ceil($(window).height()/68);
			if ($('#nicolist_thumb_res').prop('checked')){
				if (k < startLazyLoad){
					a.append(createThumbImgElem(_id, false));
				} else {
					a.append(createStayUnloadedTNI(_id, false));
				}
			}
			var span;
			if ($('#nicolist_hightlight').prop('checked')){
				_t = escapeHtmlSpecialChars(_t);
				for (var j = 0; j < sq.length; j++) {
					_t = _t.replace(new RegExp(sq[j], 'gi'), function(x){
						return '<mark>'+x+'</mark>';
					});
				}//j
				span = $('<span>', {html: _t});
			} else {
				span = $('<span>', {text: _t});
			}
			a.append(span);
			a.appendTo(div);
			div.appendTo('#sr');
		}//k
	}//i
	$('#sr').fadeIn();
	dismissAllWarningAlerts();
}
function getVideoURL(id){
	if ((new RegExp("^sm\\d+$")).test(id)
		|| (new RegExp("^nm\\d+$")).test(id)
		|| (new RegExp("^so\\d+$")).test(id)
		|| (new RegExp("^\\d+$")).test(id)){
		return 'http://www.nicovideo.jp/watch/' + id;
	} else {
		return 'https://www.youtube.com/watch?v=' + id;
	}
}
function getThumbURL(id){
	if ((new RegExp("^sm\\d+$")).test(id)){
		var numid = int(id);
		return 'http://tn.smilevideo.jp/smile?i='+numid;
	} else if ((new RegExp("^nm\\d+$")).test(id)){
		var numid = int(id);
		return 'http://tn.smilevideo.jp/smile?i='+numid;
	} else if ((new RegExp("^so\\d+$")).test(id)){
		var numid = int(id);
		return 'http://tn.smilevideo.jp/smile?i='+numid;
	} else if ((new RegExp("^\\d+$")).test(id)){
		var numid = int(id);
		return 'channel.jpg';
	} else {
		return 'https://img.youtube.com/vi/'+id+'/0.jpg'
	}
}
function videoIdMatch(str){
	var m_sm = str.match(/nicovideo\.jp\/watch\/(sm\d+)/);
	if (m_sm){
		return m_sm[1];
	}
	var m_nm = str.match(/nicovideo\.jp\/watch\/(nm\d+)/);
	if (m_nm){
		return m_nm[1];
	}
	var m_so = str.match(/nicovideo\.jp\/watch\/(so\d+)/);
	if (m_so){
		return m_so[1];
	}
	var m_cn = str.match(/nicovideo\.jp\/watch\/(\d+)/);
	if (m_cn){
		return m_cn[1];
	}
	var m_yt = str.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
	if (m_yt){
		return m_yt[1];
	}
	var m_yt2 = str.match(/youtube\.com\/watch\?[^&]+&v=([a-zA-Z0-9_-]+)/);
	if (m_yt2){
		return m_yt2[1];
	}
}
function sub(){
	if (checkValidity()){
		var title = $('#title').val();
		var genre = $('#genre').val();
		var id = videoIdMatch($('#url').val());
		if (!has(genre, id)){
			pushPrev();
			y[genre].push(id);
			y[genre].push(title);
			refresh('v');//video change
			$('#url').val("");
			$('#title').val("");
			$('#url, #title').removeClass('is-valid');
			if (!$('#registry').hasClass('silent')){
				$('#registry').addClass('silent');
			}
			$('#registry').html('');
			lastId = '';
			dismissAllWarningAlerts();
			if ($('#nicolist_stayopen').prop('checked')){
				messageUndoable('動画「'+restrBytesize(title, 50)+'」を追加しました', 'success', '#alert-addvideo');
			} else {
				messageUndoable('動画「'+restrBytesize(title, 50)+'」を追加しました', 'success',);
				$('#addVideoModal').modal('hide');
			}
		} else {
			message('すでに登録されています', 'warning', '#alert-addvideo');
		}
	}
}
function checkTitleValidity($node){
	if ($node.val() === ''
		|| $node.val().length > 100 
		|| $node.val().match(/^http:\/\//) 
		|| $node.val().match(/^https:\/\//)){
		$node.removeClass('is-valid');
		$node.addClass('is-invalid');
		return false;
	} else {
		$node.removeClass('is-invalid');
		$node.addClass('is-valid');
		return true;
	}
}
function checkURLValidity(){
	var m = videoIdMatch($('#url').val());
	if (m){
		$('#url').removeClass('is-invalid');
		$('#url').addClass('is-valid');
		if (m !== lastId){
			$('#registry').html('');
			var already = $('<ul>', {
				'class': 'list-unstyled'
			});
			var _keys = Object.keys(y);
			for (var j = 0; j < _keys.length; j++) {
				var genre = _keys[j];
				var list = y[genre];
				for (var i = 0; i < list.length/2; i++) {
					var id = list[2*i];
					var title = list[2*i+1];
					if (id === m){
						already.append(
							$('<li>', {
								text: genre
							}).append($('<span>', {
								text: '('+restrBytesize(title, 80)+')',
								'class': 'ml-2 text-muted' 
							}))
						);
					}
				}
			}
			var div = $('<div>', {
				'class': 'd-flex align-items-center flex-row'
			});
			div.append(createThumbImgElem(m, false));
			if (already.html() !== ''){
				$('#registry').prepend($('<div>',{
					text: 'この動画はすでに以下のジャンルに登録されています:',
					'class': 'mb-2 text-muted'
				}));
				div.append(already);
				div.appendTo('#registry');
			} else {
				div.append($('<span>',{
					text: 'サムネイルはこのように表示されます',
					'class': 'text-muted'
				}));
				div.appendTo('#registry');
			}
			$('#registry').removeClass('silent');
			lastId = m;
		}
		return true;
	} else {
		$('#url').removeClass('is-valid');
		$('#url').addClass('is-invalid');
		$('#registry').addClass('silent');
		return false;
	}
}
function checkGenreValidity(){
	if ($('#genre').val() === ''){
		$('#genre').addClass('is-invalid');
		return false;
	}
	return true;
}
function checkValidity(){
	var flag = checkGenreValidity();
	flag = checkURLValidity() && flag;
	flag = checkTitleValidity($('#title')) && flag;
	if (!flag){
		$('#button').prop('disabled', true);
	} else {
		$('#button').prop('disabled', false);
	}
	return flag;
}
function pushHistory(queryStr) {
	if ($.inArray(queryStr, searchHistory) === -1){
		var _a = [];
		_a.push(queryStr);
		var count = Math.min(int($('#nicolist_historyCount').val())-1, searchHistory.length);
		for (var i = 0; i < count; i++) {
			_a.push(searchHistory[i]);
		}
		searchHistory = _a;
	} else {
		var _a = [];
		_a.push(queryStr);
		for (var i = 0; i < searchHistory.length; i++) {
			if (i !== $.inArray(queryStr, searchHistory)){
				_a.push(searchHistory[i]);
			}
		}
		searchHistory = _a;
	}
	localStorage.setItem('searchhistory', JSON.stringify(searchHistory));
}
function registerEventListener(){
	$(window).resize(function() {
		if (isNullOrUndefined($('#play iframe').length) || $('#play iframe').length === 0) return;
		videoResize();
	});
	$(window).on('unload', function(){
		unload();
	});
	$(window).scroll(function(){
		var horizon = $(window).height() + $('html,body').scrollTop();
		$('#right, #sr').find('img[data-src]').each(function(i, elem){
			if ($(elem).offset().top < horizon){
				loadImg($(elem));
				$(elem).removeAttr('data-src');
			}
		});
	});
	$('input[type=checkbox]').on('change', function(){
		var id = $(this).attr('id');
		if (id){
			window.localStorage.setItem(id, $(this).prop('checked'));
		}
	});
	$('#click_action').on('change', function(){
		localStorage.setItem('nicolist_click_action', $(this).val());
	});
	$('#openPref').on('click', function(){
		$('#nicolist_separator').removeClass('is-valid');
		$('#prefModal').modal('show');
	});
	$('#reset_sep').on('click', function(){
		$('#nicolist_separator').val(SEP_DEF_VAL);
		localStorage.setItem('nicolist_separator', $('#nicolist_separator').val());
		$('#nicolist_separator').removeClass('is-valid');
	});
	$('#nicolist_separator').on('input', function(){
		localStorage.setItem('nicolist_separator', $('#nicolist_separator').val());
		$('#nicolist_separator').addClass('is-valid');
	});
	$('#addVideoModal').on('dragover', function (e) {
		e.stopPropagation();
		e.preventDefault();
		if (e.pageX > $('body').outerWidth(true)/2) {
			$('#title').addClass('dragging');
			$('#url').removeClass('dragging');
		} else {
			$('#url').addClass('dragging');
			$('#title').removeClass('dragging');
		}
	});
	$('#addVideoModal').on('dragleave', function (e){
		e.stopPropagation();
		e.preventDefault();
		$('#url, #title').removeClass('dragging');
	});
	$('#addVideoModal').on('drop', function (e){
		e.preventDefault();
		var sel = '#url';
		if (e.pageX > $('#addVideoModal').outerWidth(true)/2) {
			sel = '#title';
		}
		var data = e.originalEvent.dataTransfer.items;
		for (var i = 0; i < data.length; i += 1) {
			if ((data[i].kind === 'string') && (data[i].type.match('^text/plain'))) {
				data[i].getAsString(function (s){
					$(sel).val(s);
					checkValidity();
				});
			} else if ((data[i].kind === 'string') &&  (data[i].type.match('^text/html'))) {
				data[i].getAsString(function (s){
					var m = s.match(/<[^><]+>[^><]*(?=<)/g);
					var s2 = null;
					if (m){
						for (j = 0; j < m.length; j++){
							if (m[j].match(/<span id="video-title"/)){
								s2 = m[j].replace(/<[^><]+>/g, '').replace(/^\s+/, '').replace(/\s+$/, '').replace(/\n/g, '');
								$('#title').val(s2);
							}
						}
					}
					if (s2 == null){
						var s2 = s.replace(/<[^><]+>/g, '').replace(/^\s+/, '').replace(/\s+$/, '').replace(/\n/g, '');
						$('#title').val(s2);
					}
					checkValidity();
				});
			} else if ((data[i].kind == 'string') && (data[i].type.match('^text/uri-list'))) {
				data[i].getAsString(function (s){
					$('#url').val(s);
					checkValidity();
				});
			}
		} 
		$(sel).removeClass('dragging');
	});
	$('#url, #title').on('input', function(e){
		checkValidity();
	});
	$('body').on('click', function(e){
		if (showingMenu){
			closeMenu();
		}
		$('#history').css('display', 'none');
	});
	$('#menu').on('click', function(e){
		e.stopPropagation();
	});
	$('#addgenre').on('click', function (e){
		e.stopPropagation();
		if (addGenre($('#genrename').val())){
			setSelGen($('#genrename').val());
			$('#genreModal').modal('hide');
			$('#genrename').val('');
			refresh('gs');
		} else {
			$('#genrename').blur();
			$('#genrename').focus();
		}
	});
	$('#genrename').on("keypress", function(e) {
		if (e.keyCode === 13) { // Enter
			e.preventDefault();
			e.stopPropagation();
			if (addGenre($('#genrename').val())){
				setSelGen($('#genrename').val());
				$('#genreModal').modal('hide');
				$('#genrename').val('');
				refresh('gs');
			} else {
				$('#genrename').blur();
				$('#genrename').focus();
			}
		}
	});
	$('#button').on('click', function (e){
		sub();
	});
	$('#genreModal').on('shown.bs.modal', function () {
		$('#genrename').focus();
	});
	$('#genre').on('change', function (){
		setSelGen($(this).val());
		refresh('s');
	});
	$('#saveEdit').on('click', function(){
		var id = $('#editUrl').text();
		var title = $('#editTitle').val();
		var genre = $('#editGenre').val();
		var oldtitle = $(this).attr('data-title');
		var oldgenre = $(this).attr('data-genre');
		if (title == ''){
			message('タイトルが空欄です', 'warning', '#emalert');
			$('#editTitle').addClass('is-invalid');
		} else if (genre == ''){
			message('ジャンルが正しく選択されていません', 'warning', '#emalert');
			$('#editGenre').addClass('is-invalid');
		} else if (title == oldtitle && genre == oldgenre){
			message('変更なしになっています', 'warning', '#emalert');
			$('#editTitle').addClass('is-invalid');
			$('#editGenre').addClass('is-invalid');
		//} else if ($.inArray(id, y[genre]) !== -1){
			//message('既に移動先のジャンルに登録されている動画です', 'warning', '#emalert');
		} else {
			var mesElem = $('<div>');
			var table = $('<table>', {'class':'mb-4'});
			var tr1 = $('<tr>');
			tr1.append($('<td>', {text: 'タイトル: '}));
			var td1 = $('<td>');
			td1.append($('<strong>', {text: title}));
			if (oldtitle===title) td1.append($('<span>', {text: ' (変更なし)'}))
				td1.appendTo(tr1);
			tr1.appendTo(table);
			if (oldtitle!==title){
				var tr2 = $('<tr>', {'class': 'gray'});
				tr2.append($('<td>', {text: '変更前: '}));
				tr2.append($('<td>', {text: oldtitle}))
				tr2.appendTo(table);
			}
			var tr3 = $('<tr>');
			tr3.append($('<td>', {text: 'ジャンル: ','class':'confirmedit'}));
			var td2 = $('<td>',{'class':'confirmedit'});
			td2.append($('<strong>', {text: genre}));
			if (oldgenre===genre) td2.append($('<span>', {text: ' (変更なし)'}))
				td2.appendTo(tr3);
			tr3.appendTo(table);
			if (oldgenre!==genre){
				var tr4 = $('<tr>', {'class': 'gray'});
				tr4.append($('<td>', {text: '変更前: '}));
				tr4.append($('<td>', {text: oldgenre}))
				tr4.appendTo(table);
			}
			mesElem.append(table);
			mesElem.append($('<span>', {text:'変更を保存しますか?'}));
			confAvoidable(mesElem, function(){
				var _y = copy(y);
				var list = _y[oldgenre];
				var newlist = [];
				for (var i = 0; i < list.length/2; i++){
					if (list[2*i] !== id){
						newlist.push(list[2*i]);
						newlist.push(list[2*i+1]);
					} else if (oldgenre === genre){
						newlist.push(id);
						newlist.push(title);
					}
				}
				_y[oldgenre] = newlist;
				if (oldgenre !== genre){
					_y[genre].push(id);
					_y[genre].push(title);
				}
				pushPrev();
				y = _y;
				messageUndoable('動画「'+title+'」の動画情報を更新しました', 'info');
				refresh('v');
				$('#editModal').modal('hide');
				dismissAllWarningAlerts();
			});
		}
	});
	$('#editModal').on('hidden.bs.modal', function(){
		$('#editTitle').removeClass('is-invalid');
		$('#editGenre').removeClass('is-invalid');
		$('#emalert').html('');
	})
	$('#nicolist_historyCount').on('change', function(){
		var sh = $(this).val();
		if (int(sh) > 0){
			localStorage.setItem('nicolist_historyCount', sh);
		}
	});
	$('#nicolist_msc').on('change', function(){
		var sh = $(this).val();
		if (int(sh) > 0){
			localStorage.setItem('nicolist_msc', sh);
		}
	});
	$('#nicolist_loop').on('change', function(){
		var _x = $('#play iframe').length;
		if (!isNullOrUndefined(_x) && _x !== 0) {
			if ($('#nicolist_loop').prop('checked')){
				$('#pcloop img').attr('src', LOOP_DATA_URL);
				$('#pcloop').attr('title', 'ループ再生を解除');
			} else {
				$('#pcloop img').attr('src', NOT_LOOP_DATA_URL);
				$('#pcloop').attr('title', 'ループ再生');
			}
			registerTooltip($('#pcloop'));
			refreshController();
		}
	});
	$('#nicolist_cinematic').on('change', function(){
		var _x = $('#play iframe').length;
		if (!isNullOrUndefined(_x) && _x !== 0) {
			if ($('#nicolist_cinematic').prop('checked')){
				$('#pcwidth img').attr('src', NARROW_DATA_URL);
				$('#pcwidth').attr('title', '固定サイズで表示');
			} else {
				$('#pcwidth img').attr('src', WIDEN_DATA_URL);
				$('#pcwidth').attr('title', 'ワイド画面で表示');
			}
			registerTooltip($('#pcwidth'));
			refreshController();
		}
		videoResize();
	})
	$('#searchQuery').on('focus', function (e) {
		if (searchHistory.length === 0) return;
		$('#history').html('');
		for (var i = 0; i < searchHistory.length; i++) {
			var item = searchHistory[i];
			$('<a>', {
				text: item,
				'class': 'dropdown-item pointer',
				click: function(e){
					$('#searchQuery').val($(this).text());
					search($('#searchQuery').val());
				}
			}).appendTo('#history');
		}//i
		$('#history').css({
			'min-width': $(this).outerWidth() + 'px',
			'display': 'inline-block',
			'top': $(this).offset().top + $(this).outerHeight(),
			'left': $(this).offset().left
		});
	});
	$('#searchQuery').on('click', function (e) {
		e.stopPropagation();
	});
	$('#search').on('click', function(e){
		search($('#searchQuery').val());
	});
	$('#ccopen').on('click', function(){
		$('#ccvideos').html('');
		$('#ccalert').html('');
		var _keys = Object.keys(y);
		for (var j = 0; j < _keys.length; j++) {
			var genre = _keys[j];
			var genre_name = $('<p>',{
				'click': function(){
					var thisElem = $(this);
					if ($('#nicolist_thumb_cc').prop('checked')){
						thisElem.next().find('.img-thumbnail').each(function(i, elem){
							loadImg($(elem));
						});
					} else {
						thisElem.next().find('.img-thumbnail').each(function(i, elem){
							$(elem).attr('data-loadstatus', 'ready');
						});
					}
					if (thisElem.next().css('display') === 'none'){
						thisElem.next().fadeIn();
						thisElem.parent().find('.ccgenrename').each(function(i, elem){
							if ($(elem).text() !== thisElem.text() && $(elem).next().css('display') !== 'none'){
								$(elem).next().css('display', 'none');
								$(elem).find('.genre_indicator').text('-');
							}
						});
						thisElem.find('.genre_indicator').text('+');
					} else {
						thisElem.next().fadeOut();
						thisElem.find('.genre_indicator').text('-');
					}
					return false;
				},
				text: genre,
				'class':'ccgenrename'
			});
			genre_name.prepend($('<span>', {
				text: '-',
				'class': 'genre_indicator mr-1'
			}));
			var genre_count = $('<span>',{
				'data-count':'0',
				'class': 'badge badge-pill badge-secondary2 ml-2'
			});
			var ccwrapper = $('<div>', {
				'class':'ccwrapper'
			})
			var videos_table = $('<table>',{
				'class':'cctable'
			});
			var list = y[genre];
			if ($('#nicolist_sort').prop('checked')){
				list = reversePairList(list);
			}
			for (var i = 0; i < list.length/2; i++) {
				var id = list[2*i];
				var title = list[2*i+1];
				var tr = $('<tr>', {
					'class':'ccvideo',
					'data-title': title,
					'data-id':id,
					'data-genre':genre,
					'click': function(){
						var elem = $(this).parent().parent().prev().find('span[data-count]');//gomi
						var count = int(elem.attr('data-count'));
						if ($(this).hasClass('alert-success')){
							$(this).removeClass('alert-success');
							count--;
						} else {
							$(this).addClass('alert-success');
							count++;
						}
						elem.attr('data-count', count);
						if (count === 0) {
							elem.css('display', 'none');
						} else {
							elem.css('display', 'inline-block');
							elem.text(count+'');
						}
					}
				});
				var td1 = $('<td>');
				var img = createStayUnloadedTNI(id, false);
				if (!$('#nicolist_thumb_cc').prop('checked')){
					img.addClass('silent');
				}
				td1.append(img);
				tr.append(td1);
				var td2 = $('<td>',{
					text: title
				});
				tr.append(td2);
				videos_table.append(tr);
			}//i
			genre_name.append(genre_count);
			$('#ccvideos').append(genre_name);
			ccwrapper.append(videos_table);
			$('#ccvideos').append(ccwrapper);
		}//j
		$('#ccModal').modal('show');
	});
	$('#pcclose').on('click', function(){
		$('#play').html('');
		$('#pclist').addClass('silent').html('');
		$('#controller').addClass('silent');
		playindex = -1;
		playlist = [];
	});
	$('#pcnewtab').on('click', function(){
		window.open(domain+'/player.html?pl='+escape(JSON.stringify(playlist))+'&i='+playindex);
	});
	$('#pclist').on('change', function(){
		playindex = parseInt($('#pclist').val(), 10);
		if (isNaN(playindex)) playindex = 0;//wont happen
		autoplay = false;
		refreshPlayer();
	});
	$('#pcnext').on('click',function(){
		if ($(this).hasClass('disabled')) return;
		autoplay = true;
		next();
	});
	$('#pcprev').on('click',function(){
		if ($(this).hasClass('disabled')) return;
		autoplay = true;
		previous();
	});
	$('#pcloop').on('click', function(){
		if ($('#nicolist_loop').prop('checked')){
			$('#nicolist_loop').prop('checked', false);
			localStorage.setItem('nicolist_loop', false);
			$('#pcloop img').attr('src', NOT_LOOP_DATA_URL);
			$('#pcloop').attr('title', 'ループ再生');
		} else {
			$('#nicolist_loop').prop('checked', true);
			localStorage.setItem('nicolist_loop', true);
			$('#pcloop img').attr('src', LOOP_DATA_URL);
			$('#pcloop').attr('title', 'ループ再生を解除');
		}
		$('#pcloop').tooltip('dispose');
		registerTooltip($('#pcloop'));
		$('#pcloop').tooltip('show');
		refreshController();
	});
	$('#pcwidth').on('click', function(){
		if ($('#nicolist_cinematic').prop('checked')){
			$('#nicolist_cinematic').prop('checked', false);
			localStorage.setItem('nicolist_cinematic', false);
			$('#pcwidth img').attr('src', WIDEN_DATA_URL);
			$('#pcwidth').attr('title', 'ワイド画面で表示');
		} else {
			$('#nicolist_cinematic').prop('checked', true);
			localStorage.setItem('nicolist_cinematic', true);
			$('#pcwidth img').attr('src', NARROW_DATA_URL);
			$('#pcwidth').attr('title', '固定サイズで表示');
		}
		$('#pcwidth').tooltip('dispose');
		registerTooltip($('#pcwidth'));
		$('#pcwidth').tooltip('show');
		videoResize();
	});
	$('#sgopen').on('click', function(){
		$('#sggenre').html('');
		var gs = Object.keys(y);
		for (i = 0; i< gs.length; i++){
			var g = gs[i];
			var clazz = 'sgg '+(i != 0 ? 'sgtarget' : 'sgdef');
			var div = $('<div>',{
				text: g,
				'class': clazz
			});
			$('#sggenre').append(div);
		}
		$('#genreSortModal').modal('show');
		Sortable.create(sggenre, {
			draggable: '.sgtarget',
			animation: 300
		});
	});
	$('#submitGenreSort').on('click', function(){
		pushPrev();
		var _y = {};
		$('.sgg').each(function(i, elem){
			var g = $(elem).text();
			_y[g] = y[g];
		});
		y = _y;
		refresh('g');
		messageUndoable('ジャンルを並び替えしました', 'success');
		$('#genreSortModal').modal('hide');
	});

	$('#createcopy').on('click', function(){
		if ($('#ccvideos tr.alert-success').length === 0){
			message('動画が選択されていません。', 'warning', '#ccalert');
			$('#ccModal').stop().animate({scrollTop:0}, 'slow');
			return;
		}
		var mode = $('#ccnew').val();
		if (mode === 'copytoold' || mode === 'movetoold') {
			var targetgenre = $('#ccoldsel').val();
			if (!y.hasOwnProperty(targetgenre)){
				message('ジャンルを選択してください。', 'warning', '#ccalert');
				return;
			}
			var remove_cc = mode === 'movetoold';
			var failcount = 0;
			var successcount = 0;
			var _y = copy(y);
			$('#ccvideos tr.alert-success').each(function(){
				var id = $(this).attr('data-id');
				var title = $(this).attr('data-title');
				if ($.inArray(id, _y[targetgenre]) === -1){
					_y[targetgenre].push(id);
					_y[targetgenre].push(title);
					if (remove_cc){
						var genre = $(this).attr('data-genre');
						var list2 = _y[genre];
						var newlist = [];
						for (var i = 0; i < list2.length/2; i++){
							if (list2[2*i] !== id){
								newlist.push(list2[2*i]);
								newlist.push(list2[2*i+1]);
							}
						}
						_y[genre] = newlist;
					}
					successcount++;
				} else {
					failcount++;
				}
			});
			var __a = remove_cc?'移動':'コピー';
			if (successcount > 0){
				pushPrev();
				y = _y;
				messageUndoable(successcount+'個の動画を「'+targetgenre+'」に'+__a+'しました'+(failcount>0?' ('+failcount+'個の動画は既に登録されているため'+__a+'されません)':''), 'success');
			} else {
				message('すべて「'+targetgenre+'」に登録済みの動画です', 'warning', '#ccalert');
				$('#ccModal').stop().animate({scrollTop:0}, 'slow');
				return;
			}
			setSelGen(targetgenre);
			refresh('gvs');
			dismissAllWarningAlerts();
			$('#ccModal').modal('hide');
		} else if (mode === 'copytonew' || mode === 'movetonew') {
			var remove_cb = mode === 'movetonew';
			var ccname = $('#ccname').val();
			if (ccname === ''){
				message('作成するジャンルの名前を入力してください。', 'warning', '#ccalert');
				$('#ccModal').stop().animate({scrollTop:0}, 'slow');
				return;
			} else if (y.hasOwnProperty(ccname)){
				message('既に存在するジャンル名です。', 'warning', '#ccalert');
				$('#ccModal').stop().animate({scrollTop:0}, 'slow');
				return;
			} else {
				pushPrev();
				var list = new Array();
				$('#ccvideos tr.alert-success').each(function(){
					var title = $(this).attr('data-title');
					var id = $(this).attr('data-id');
					if (remove_cb){
						var genre = $(this).attr('data-genre');
						var list2 = y[genre];
						var newlist = [];
						for (var i = 0; i < list2.length/2; i++){
							if (list2[2*i] !== id){
								newlist.push(list2[2*i]);
								newlist.push(list2[2*i+1]);
							}
						}
						y[genre] = newlist;
					}
					if ($.inArray(id, list) === -1){
						list.push(id);
						list.push(title);
					}
				});
				y[ccname] = list;
				var __a = remove_cc?'移動':'コピー';
				messageUndoable('「'+ccname+'」に'+(list.length/2)+'個の動画を'+__a+'しました', 'success');
				setSelGen(ccname);
				refresh('gvs');
				dismissAllWarningAlerts();
				$('#ccModal').modal('hide');
				$('#ccname').val('');
			}
		}
	});
	$('#issueRaw').on('click', function(){
		var d = new Date();
		promptWinExplorer('backup_'+d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'.json', JSON.stringify(y));
	});
	$('#fromRawFile').on('change', function (e){
		var files = e.target.files;
		if (files.length !== 1) {
			message('正しいファイルを選択してください', 'warning', '#prefalert');
			return;
		}
		if (!files[0].type.match(/json/)){
			message('jsonファイルを選択してください', 'warning', '#prefalert');
			return;
		}

		var reader = new FileReader();
		reader.readAsText(files[0]);

		reader.onload = function (){
			try {
				var toload = JSON.parse(reader.result);
			} catch (e){
				message('フォーマットが正しくありません', 'warning', '#prefalert');
				return;
			}
			var videocount = 0;
			var genrecount = 0;
			if (!(toload instanceof Object)){
				message('フォーマットが正しくありません', 'warning', '#prefalert');
				return;
			}
			var _y = copy(y);
			var _tkeys = Object.keys(toload);
			for (var j = 0; j < _tkeys.length; j++) {
				var genre = _tkeys[j];
				var list = toload[genre];
				if (!(list instanceof Array)){
					message('フォーマットが正しくありません', 'warning', '#prefalert');
					return;
				}
				for (var i = 0; i < list.length/2; i++){
					var id = list[2*i];
					var title = list[2*i+1];
					if (!_y.hasOwnProperty(genre)) {
						_y[genre] = [];
						genrecount++;
					}
					if ($.inArray(id, _y[genre]) === -1){
						_y[genre].push(id);
						_y[genre].push(title);
						videocount++;
					}
				}
			}//j
			if (videocount === 0 && genrecount === 0){
				message('すべて登録済みの動画です', 'warning', '#prefalert');
			} else {
				pushPrev();
				y = _y;
				messageUndoable('JSONから'+(videocount>0?videocount+'個の動画':'')+(genrecount>0&&videocount>0?'、':'')+(genrecount>0?genrecount+'個のジャンル':'')+'を新たに読み込みました', 'success');
				refresh((genrecount>0?'g':'')+(videocount>0?'v':''));
				dismissAllWarningAlerts();
				$('#prefModal').modal('hide');
			}
		};
	});
}
function init(){
	registerEventListener();

	if (typeof localStorage === 'undefined'){
		if (document.cookie){
			var Storage2 = function(){
				this.data = {};
				var _s = document.cookie.match(/ls_[^=;]+=[^;=]*/g);
				if (_s){
					for (var i = 0; i < _s.length; i++) {
						var _t = _s[i].split(/=/);
						this.data[unescape(_t[0].substring(3))] = _t[1];
					}
				}
			};
			Storage2.prototype.getItem = function(key) {
				return this.data[key];
			};
			Storage2.prototype.setItem = function(key, val) {
				if (key){
					var _d = new Date();
					_d.setTime(Date.now() + 114514*60*1000);//almost 13 years
					document.cookie = 'ls_' + escape(key) + '=' + escape(val) + '; expires='+_d.toUTCString()+'; path=/';
					this.data[key] = val;
				}
			};
			Storage2.prototype.removeItem = function(key) {
				if (key){
					document.cookie = 'ls_' + escape(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
					delete this.data[key];
				}
			};
			localStorage = new Storage2();
			if (document.cookie === ''){
				// first visit
				message('お使いのブラウザはローカルストレージをサポートしていないため、代わりにcookieを使用してデータを保存しています。', 'warning');
			}
		} else {
			message('ローカルストレージ・Cookieが利用できないためデータを保存することができません。', 'danger', null, true);
		}
	}

	if (islocal) {
		$('#local_indicator').removeClass('silent');
	}

	$('input[type=checkbox]').each(function(){	
		var id = $(this).attr('id');
		if (id){
			var bool = window.localStorage.getItem(id);
			if (bool === 'true'){
				$(this).prop('checked', true);
			} else if (bool) {
				$(this).prop('checked', false);
			}
		}
	});

	var sepls = localStorage.getItem('nicolist_separator');
	if (sepls) {
		$('#nicolist_separator').val(sepls);
	} else {
		$('#nicolist_separator').val(SEP_DEF_VAL);
	}

	var cals = localStorage.getItem('nicolist_click_action');
	if (cals && cals !== ''){
		$('#click_action').val(cals);
	}

	var tabs = localStorage.getItem('_nicolistTabCount');
	if (tabs){
		tabs = int(tabs);
		if (!isNaN(tabs)){
			if (!$('#nicolist_multitab').prop('checked')){
				var errorspan = $('<span>');
				$('<span>', {
					text: '正しく終了されませんでしたか？',
					'class': 'undo ml-1 mr-1',
					'click': function(){
						localStorage.setItem('_nicolistTabCount', 1);
						$('#alert').fadeOut('slow', refreshStyle);
					}
				}).appendTo(errorspan);
				$('<span>', {
					text: '/',
					'class': 'ml-1 mr-1'
				}).appendTo(errorspan);
				$('<span>', {
					text: 'このアラートが常に表示される場合',
					'class': 'undo ml-1',
					'click': function(){
						$('#nicolist_multitab').prop('checked', true);
						localStorage.setItem('nicolist_multitab', 'true');
						$('#laert').fadeOut('slow', refreshStyle);
					}
				}).appendTo(errorspan);
				message('複数タブで同時に閲覧している可能性があります。', 'danger', null, true, errorspan);
			}
			localStorage.setItem('_nicolistTabCount', tabs+1);
		}
	} else {
		localStorage.setItem('_nicolistTabCount', 1);
	}
	var l = localStorage.getItem('nicolist');
	if (l){
		try {
			l = JSON.parse(l);
			y = l;
		} catch(e) {
			message(e, 'danger');
		}
	}
	var s = localStorage.getItem('selectedgenre');
	if (Object.keys(y).length > 0){
		if (s){
			setSelGen(s);
		} else {
			setSelGen(Object.keys(y)[0]);
		}
	}
	var cnew = localStorage.getItem('nicolist_ccnewval');
	if (cnew){
		$('#ccnew').val(cnew);
	}
	ccnew();
	var sh = localStorage.getItem('searchhistory');
	if (sh){
		searchHistory = JSON.parse(sh);
		if (!Array.isArray(searchHistory)){
			searchHistory = [];
		}
	}
	var nh = localStorage.getItem('nicolist_historyCount');
	if (nh){
		$('#nicolist_historyCount').val(int(nh));
	}
	var nh2 = localStorage.getItem('nicolist_msc');
	if (nh2){
		$('#nicolist_msc').val(int(nh2));
	}
	var ld = localStorage.getItem('nicolist_deleted');
	if (ld){
		try {
			deletedVideoArray = JSON.parse(ld);
			if (!Array.isArray(deletedVideoArray)){
				deletedVideoArray = [];
			}
		} catch(e) {
		}
	}
	var ls = localStorage.getItem('nicolist_star');
	if (ls){
		try {
			starred = JSON.parse(ls);
			if (!Array.isArray(starred)){
				starred = [];
			}
		} catch(e) {
		}
	}
	var lz = localStorage.getItem('nicolist_volumemap');
	if (lz){
		try {
			lz = JSON.parse(lz);
			if (lz instanceof Object){
				volumemap = lz;
			}
		} catch(e) {
			message(e, 'danger');
		}
	}
	registerTooltip($('#controller span[title]'));
	refresh('vgs');
}
function registerTooltip($elem){
	$elem.tooltip({
		'placement': 'bottom',
		'animation': false,
		'template': '<div class="tooltip mt-2" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
	});
}
function unload(){
	var tabs = int(localStorage.getItem('_nicolistTabCount'));
	if (tabs === 1){
		localStorage.removeItem('_nicolistTabCount');
	} else if (tabs >= 2){
		localStorage.setItem('_nicolistTabCount', tabs-1);
	}
}
//TODO: これだとforが3回も回って無駄なので、コードは増えるがforを一回で回すようにするか、
//そうしないにしても易読性・利便性・バグ防止のために別々のfunctionにするのが合理的 
function refresh(whatChanged){
	if (!y.hasOwnProperty(selectedGenre)){
		setSelGen('とりあえず');
	}
	var videoChanged = whatChanged.indexOf('v') !== -1;
	var genreChanged = whatChanged.indexOf('g') !== -1;
	var selectChanged = whatChanged.indexOf('s') !== -1;
	if (selectChanged){
		if ($('#favs li').hasClass('selected')){
			$('#favs li').removeClass('selected');
		}
		refreshFavsLeft();
	}
	if (selectChanged || genreChanged){
		//genreのselectの更新
		//#leftの更新
		$("select[role='genre']").html('');
		$('#left').html('');
		var _keys = Object.keys(y);
		for (var i = 0; i < _keys.length; i++) {
			var genre = _keys[i];
			//select更新
			$("select[role='genre']").each(function(i, elem){
				$(elem).append($('<option>', {
					'value': genre,
					text: genre
				}));
			});
			//#left更新
			$('<li>', {
				'class': (genre === selectedGenre ? 'list-group-item selected' : 'list-group-item'),
				text: genre,
				click: function(){
					var genre2 = $(this).text();
					setSelGen(genre2);
					refresh('s');
				}
			}).appendTo("#left");
		}//i
		$('select[role="genre"]').val(selectedGenre);
	}
	if (selectChanged || genreChanged || videoChanged){
		//#rightの更新
		$("#right").html('');
		if ($('#favs li').hasClass('selected')){
			showFavs();
		} else {
			var displayThumb = $('#nicolist_thumb').prop('checked');
			if (selectedGenre === 'とりあえず'){
				$("<h4>", {
					text: selectedGenre
				}).append(
					$('<small>', {
						'class': 'text-muted ml-2',
						text: '('+(y[selectedGenre].length/2)+')'
					})
				).appendTo("#right");
			} else {
				$("<h4>", {
					text: selectedGenre
				}).append(
					$('<small>', {
						'class': 'text-muted ml-2 mr-1',
						text: '('+(y[selectedGenre].length/2)+')'
					})
				).append(
					$('<small>', {
						'class': 'removevideo',
						'data-genre' : selectedGenre,
						'title': 'ジャンルを削除',
						text: '×',
						click: function() {
							removeGenre($(this));
						}
					})
				).appendTo('#right');
			}
			var list = y[selectedGenre];
			if ($('#nicolist_sort').prop('checked')){
				list = reversePairList(list);
			}
			var startLazyLoad = Math.ceil($(window).height()/68);
			for (var i = 0; i < list.length/2; i++){
				var id = list[2*i];
				var title = list[2*i+1];

				var div = rightVideoElem(id, title, selectedGenre, (i>startLazyLoad));

				div.appendTo("#right");
			}//i
		}
	}
	if (genreChanged || videoChanged){
		$('#out').val(JSON.stringify(y, null, '    '));
		localStorage.setItem('nicolist', JSON.stringify(y));
		$('#length').text('('+sizeString(bytesize(JSON.stringify(y)))+')');
		if ($('#sr').html() !== ''){
			search(searchHistory[0]);
		}
	}
}
function refreshFavsLeft(){
	if (starred.length > 0){
		$('#favs').removeClass('disabled');
	} else {
		$('#favs').addClass('disabled');
	}
	$('#favlen').text((starred.length/2)+'');
}
function showFavs(){
	$('#left .selected').removeClass('selected');
	$('#favs li').addClass('selected');
	constructRightFav();
}
function constructRightFav(){
	$("#right").html('');
	var displayThumb = $('#nicolist_thumb').prop('checked');
	$("<h4>", {
		text: 'お気に入り'
	}).append($('<small>', {
		text: '×',
		'class': 'removevideo',
		'title': 'お気に入りをクリア',
		'click': function() {
			confirm2('お気に入りをクリアしますか?', function(){
				starred = [];
				refreshFavsLeft();
				if ($('#play').html() !== '') {
					refreshController();
				}
				$('.favIcon').each(function(){
					$(this).attr('src', UNSTAR_DATA_URL);
				});
				refresh('s');
				localStorage.setItem('nicolist_star', JSON.stringify(starred));
			});
		}
	})).appendTo("#right");

	var list = starred;
	if ($('#nicolist_sort').prop('checked')){
		list = reversePairList(list);
	}
	var startLazyLoad = Math.ceil($(window).height()/68);
	for (var i = 0; i < list.length/2; i++){
		var id = list[2*i];
		var title = list[2*i+1];

		var div = rightVideoElem(id, title, '', (i>startLazyLoad));

		div.appendTo('#right');
	}//i
}
function toggleFav(id, title){
	var starIndex = -1;
	for (var j = 0; j < starred.length; j+=2) {
		var stId = starred[j];
		if (stId === id){
			starIndex = j;
			break;
		}
	}
	if (starIndex === -1){
		starred.push(id);
		starred.push(title);
		$('.favIcon[data-id='+id+']').each(function(){
			$(this).attr('src', STAR_DATA_URL);
			startStarAnimation($(this));
		});
		if ($('#favs li').hasClass('selected')) {
			var _l = $('#right a[data-id='+id+']').length;
			if (isNullOrUndefined(_l) || _l === 0){
				if ($('#nicolist_sort').prop('checked')){
					rightVideoElem(id, title, '', false).insertAfter('#right h4');
				} else {
					$('#right').append(rightVideoElem(id, title, '', false));
				}
			}
		}
		return true;
	} else {
		starred.splice(starIndex, 2);
		$('.favIcon[data-id='+id+']').each(function(){
			$(this).attr('src', UNSTAR_DATA_URL);
		});
		return false;
	}
}
function rightVideoElem(id, title, genre, lazyload){
	var div = $('<div>', {
		'class': 'd-flex flex-row align-items-center'
	});
	var favIcon = createFavIcon(id, title, true);
	var a = $( "<a>", {
		"href": getVideoURL(id),
		'target': '_blank',
		'data-genre' : genre,
		'data-id' : id,
		'data-title' : title,
		'class': 'rightvideo',
		'contextmenu': function(e){
			showMenu(e.pageX, e.pageY, $(this), 'right');
			return false;
		},
		'click': function(e){
			if ($('#click_action').val() !== 'official'){
				e.preventDefault();
			}
			openVideo($(this), 'right');
		}
	});
	div.append(favIcon);
	if (!$('#nicolist_thumb').prop('checked')) {
		div.addClass('mt-1');
	}
	if ($('#nicolist_thumb').prop('checked')){
		if (lazyload) {
			a.append(createStayUnloadedTNI(id, false));
		} else {
			a.append(createThumbImgElem(id, false));
		}
	}
	if ($('#nicolist_taggedtitle').prop('checked')){
		var _ma = title.match(/【[^【】]+】/g);//【】
		var _mb = title.match(/\[[^\[\]]+\]/g);//[]
		var tags = [];
		var converted_title = title;
		if (_ma){
			for (var j = 0; j < _ma.length; j++) {
				tags.push(_ma[j]);
			}
			converted_title = converted_title.replace(/【[^【】]+】/g, '');
		}
		if (_mb){
			for (var j = 0; j < _mb.length; j++) {
				tags.push(_mb[j]);
			}
			converted_title = converted_title.replace(/\[[^\[\]]+\]/g, '');
		}
		converted_title = converted_title.replace(/^\s+/g, '').replace(/\s+$/g, '');
		a.append($('<span>',{
			text: converted_title,
			'class': 'mr-2'
		}));
		a.appendTo(div);
		for (var j = 0; j < tags.length; j++) {
			div.append($('<span>',{
				text: tags[j].slice(1, -1),
				'class': 'titletag ml-1',
				'click': function(){
					$('#search').val($(this).text());
					search($(this).text());
					var _s = $('#sr').offset().top-16;
					if (_s < $('html,body').scrollTop()){
						$('html,body').stop().animate({scrollTop:_s}, 'swing');
					}
				}
			}))
		}//j
	} else {
		a.append($('<span>',{
			text: title
		}));
		a.appendTo(div);
	}
	return div;
}
function openVideo($elem, mode){
	var id = $elem.attr('data-id');
	var title = $elem.attr('data-title');
	var genre = $elem.attr('data-genre');
	var caval = $('#click_action').val();
	if (caval === 'thispage'){
		$('#play').html('');
		playindex = 0;
		playlist = [id];
		playlistTitleMap = {};
		playlistTitleMap[id] = title;
		if (islocal) {
			window.open(domain+'/player.html?pl='+escape(JSON.stringify(playlist))+'&i='+playindex);
		} else {
			createEmbedElem();
			refreshController();
		}
	} else if (caval === 'cont' || caval === 'randomcont'){
		$('#play').html('');
		if (mode === 'right'){
			playlist = [];
			playlistTitleMap = {};
			$('#right a[data-id]').each(function(_i, elem2){
				var rvid = $(elem2).attr('data-id');
				playlist.push(rvid);
				playlistTitleMap[rvid] = $(elem2).attr('data-title');
			});
		} else if (mode === 'random'){
			playlist = [];
			playlistTitleMap = {};
			$('#randomVideo a[data-id]').each(function(_i, elem2){
				var rvid = $(elem2).attr('data-id');
				playlist.push(rvid);
				playlistTitleMap[rvid] = $(elem2).attr('data-title');
			});
		} else if (mode === 'search'){
			playlist = [];
			playlistTitleMap = {};
			$('#sr a[data-id]').each(function(_i, elem2){
				var svid = $(elem2).attr('data-id');
				playlist.push(svid);
				playlistTitleMap[svid] = $(elem2).attr('data-title');
			});
		} else {
			//wont happen
			return;
		}
		if (caval === 'randomcont'){
			playlist = randomize(playlist, id);
		}
		playindex = $.inArray(id, playlist);
		if (playindex === -1) playindex = 0;
		if (islocal) {
			window.open(domain+'/player.html?pl='+escape(JSON.stringify(playlist))+'&i='+playindex);
		} else {
			createEmbedElem();
			refreshController();
		}
		$('html,body').stop().animate({scrollTop:0}, 'swing');
	}
}
function sizeString(byte){
    if (byte < 500){
        return byte + " byte";
    } else if (byte < 500000){
        var a = Math.round( byte * 100 / 1024 ) / 100;
        return a + " KB";
    } else if (byte < 500000000){
        var a = Math.round( (byte * 100 / 1024) / 1024 ) / 100;
        return a + " MB";
    } else {
        var a = Math.round( ((byte * 100 / 1024) / 1024) / 1024 ) / 100;
        return a + " GB";
    }
}
function showMenu(coord_x, coord_y, cont, mode){
	var id = cont.attr('data-id');
	var genre = cont.attr('data-genre');
	var title = cont.attr('data-title');
	var url = cont.attr('href');
	var hasurlattr = typeof url !== typeof undefined && url !== false && url !== '';
	var hasgenreattr = typeof genre !== typeof undefined && genre !== false && genre !== '';
	$("#menu").children('a').each(function(i, elem){
		var role = $(elem).attr('role');
		if (role === 'title'){
			if (hasurlattr){
				$(elem).html('');
				var anc = $('<a>', {
					'href':url,
					text:title,
					'target':'_blank'
				});
				$(elem).append(anc);
			} else {
				$(elem).text(title);
			}
		} else if (role === 'remove'){
			if (hasgenreattr){
				$(elem).on('click', function(){
					removeVideo(cont);
					closeMenu();
				});
				if ($(elem).hasClass('disabled')){
					$(elem).removeClass('disabled');
				}
			} else {
				if (!$(elem).hasClass('disabled')){
					$(elem).addClass('disabled');
				}
			}
		} else if (role === 'edit'){
			if (hasgenreattr){
				$(elem).on('click', function(){
					showEditModal(cont);
					closeMenu();
				});
				$(elem).removeClass('disabled');
			} else {
				$(elem).addClass('disabled');
			}
		} else if (role === 'play'){
			$(elem).on('click', function(){
				$('#play').html('');
				playindex = 0;
				playlist = [id];
				playlistTitleMap = {};
				playlistTitleMap[id] = title;
				if (islocal) {
					window.open(domain+'/player.html?pl='+escape(JSON.stringify(playlist))+'&i='+playindex);
				} else {
					createEmbedElem();
					refreshController();
				}
				closeMenu();
			});
		} else if (role === 'playall' || role === 'playall-random'){
			$(elem).on('click', function(){
				$('#play').html('');
				if (mode === 'right'){
					$(elem).removeClass('disabled');
					playlist = [];
					playlistTitleMap = {};
					$('#right a[data-id]').each(function(_i, elem2){
						var rvid = $(elem2).attr('data-id');
						playlist.push(rvid);
						playlistTitleMap[rvid] = $(elem2).attr('data-title');
					});
				} else if (mode === 'random'){
					$(elem).removeClass('disabled');
					playlist = [];
					playlistTitleMap = {};
					$('#randomVideo a[data-id]').each(function(_i, elem2){
						var rvid = $(elem2).attr('data-id');
						playlist.push(rvid);
						playlistTitleMap[rvid] = $(elem2).attr('data-title');
					});
				} else if (mode === 'search'){
					$(elem).removeClass('disabled');
					playlist = [];
					playlistTitleMap = {};
					$('#sr a[data-id]').each(function(_i, elem2){
						var svid = $(elem2).attr('data-id');
						playlist.push(svid);
						playlistTitleMap[svid] = $(elem2).attr('data-title');
					});
				} else {
					//wont happen
					$(elem).addClass('disabled');
					return;
				}
				if (role === 'playall-random'){
					playlist = randomize(playlist, id);
				}
				playindex = $.inArray(id, playlist);
				if (playindex === -1) playindex = 0;
				if (islocal) {
					window.open(domain+'/player.html?pl='+escape(JSON.stringify(playlist))+'&i='+playindex);
				} else {
					createEmbedElem();
					refreshController();
				}
				$('html,body').stop().animate({scrollTop:0}, 'swing');
				closeMenu();
			});
		}
	});
	$('#menu').css({
		'display': 'inline-block',
		'top': coord_y,
		'left': coord_x
	});
	showingMenu = true;
}
function randomize(array, first){
	if (array.length <= 1) return array;
	if (first){
		var x = $.inArray(first, array);
		if (x !== -1){
			array.splice(x, 1);
		}
	}
	var n = array.length, t, i;
	while (n) {
		i = Math.floor(Math.random() * n--);
		t = array[n];
		array[n] = array[i];
		array[i] = t;
	}
	if (first && x !== -1) array.splice(0, 0, first);
	return array;
}
function showEditModal(cont){
	var id = cont.attr('data-id');
	var title = cont.attr('data-title');
	var genre = cont.attr('data-genre');
	$('#editThumb').attr('src', getThumbURL(id));
	$('#editUrl').text(id);
	$('#editUrl').parent().attr('href', getVideoURL(id));
	$('#editTitle').val(title);
	$('#editGenre').val(genre);
	$('#saveEdit').attr('data-title', title);
	$('#saveEdit').attr('data-genre', genre);
	$('#editModal').modal();
}
function closeMenu(){
	$('#menu').css('display', 'none');
	showingMenu = false;
}
function has(genre, id){
	var list = y[genre];
	for (var i = 0; i < list.length/2; i++){
		if (list[2*i] === id) return true;
	}
	return false;
}
function addGenre(name){
	if (bytesize(name) > 50){
		message('ジャンル名は49バイト以内に収める必要があります', 'warning', '#alert-genre');
		return false;
	}
	if (bytesize(name) === 0){
		message('作成するジャンルの名前を入力してください。', 'warning', '#alert-genre');
		return false;
	}
	if (!y.hasOwnProperty(name)){
		pushPrev();
		y[name] = [];
		dismissAllWarningAlerts();
		messageUndoable('ジャンル「'+name+'」を追加しました', 'success');
		return true;
	} else {
		message('ジャンル「'+name+'」は既に存在しているようです。', 'warning', '#alert-genre');
		return false;
	}
}
function removeVideo(elem){
	var genre = elem.attr('data-genre');
	var id = elem.attr('data-id');
	var title = elem.attr('data-title');
	confAvoidable('本当に動画「'+restrBytesize(title, 50)+'」を削除しますか？', function(){
		pushPrev();
		var list = y[genre];
		var newlist = [];
		for (var i = 0; i < list.length/2; i++){
			if (list[2*i] !== id){
				newlist.push(list[2*i]);
				newlist.push(list[2*i+1]);
			}
		}
		y[genre] = newlist;
		messageUndoable('動画「'+restrBytesize(title, 50)+'」を削除しました', 'danger');
		refresh('v');//video change
	});
}
function removeGenre(elem){
	var genre = elem.attr('data-genre');
	confirm2('本当にジャンル「'+genre+'」を削除しますか？\n'+(y[genre].length/2)+'個の動画が登録されています。', function(){
		var newy = {}; 
		pushPrev();
		for (var oldgenre in y){
			if (genre !== oldgenre){
				newy[oldgenre] = y[oldgenre];
			}
		}
		y = newy;
		messageUndoable('ジャンル「'+genre+'」を削除しました', 'danger');
		setSelGen(Object.keys(y)[0]);
		refresh('gs');//genre change
	});
}
function setSelGen(genre){
	if (!y.hasOwnProperty(genre)) {
		setSelGen(Object.keys(y)[0]);
		message('前回選択していたジャンルの引き継ぎ時にエラーが発生しました', 'danger');
		return;
	}
	selectedGenre = genre;
	localStorage.setItem('selectedgenre', selectedGenre);
}
function redo() {
	var _c = copy(y);
	y = copy(prevy);
	prevy = _c;
	messageUndoable('REDOしました', 'primary');
	refresh('vgs');
}
function undo() {
	var _c = copy(y);
	y = copy(prevy);
	prevy = _c;
	messageUndoable('UNDOしました', 'primary', '#alert', false, 'redo');
	refresh('vgs');
}
function message(mes, type, wrapper, permanent, elem) {
	if (typeof type !== 'string' || $.inArray(type, MESSAGE_TYPES) === -1) type = 'warning';
	if (typeof wrapper !== 'string' || wrapper === '') wrapper = '#alert';
	if (typeof permanent !== 'boolean') permanent = false;
	var div = $('<div>', {
		'class': 'alert alert-'+type
	}).css('display', 'none');
	if (!permanent){
		$('<button>', {
			html: '<span>&times;</span>',
			'type':'button',
			'class':'close',
			'click': function(){
				$(this).parent().fadeOut('slow', refreshStyle);
			}
		}).appendTo(div);
	}
	var span = $('<span>', {
		text: mes
	});
	if (elem != null && elem != undefined) {
		span.append(elem)
	};
	span.appendTo(div);
	$(wrapper).html('');
	$(wrapper).append(div);
	div.fadeIn();
}
function messageUndoable(mes, type, wrapper, permanent, toredo){
	var span;
	if (toredo === 'redo') {
		span = $('<span>', {
			text: '[REDO]',
			'class': 'undo',
			click : function(){
				redo();
			}
		});
	} else {
		span = $('<span>', {
			text: '[UNDO]',
			'class': 'undo',
			click : function(){
				undo();
			}
		});
	}
	message(mes, type, wrapper, permanent, span);
}
function confAvoidable(mes, func){
	if ($('#nicolist_del').prop('checked')){
		(func)();
	} else {
		if (typeof mes === 'string'){
			confirm2($('<span>',{text: mes}), func);
		} else {
			confirm2(mes, func);
		}
	}
}
function confirm2(mesElem, func, ondeny){
	$('#confDialog').html('');
	$('#confDialog').append(mesElem);
	$('#confOK').html('').append($('<button>', {
		text: 'はい',
		'class': 'btn btn-primary',
		click: func,
		'data-dismiss': 'modal'
	}));
	var cb = $('<button>', {
		text: 'キャンセル',
		'class': 'btn btn-secondary',
		'data-dismiss': 'modal'
	});
	if (!isNullOrUndefined(ondeny)){
		cb.on('click', function(){
			ondeny();
		});
	}
	$('#confDeny').html('').append(cb);
	$('#confModal').modal('show');
}
function pushPrev(){
	prevy = copy(y);
}
function copy(obj){
	return $.extend(true, {}, obj);
}
function randomFromAll(){
	var _temp = {};
	var sum = 0;
	var _keys = Object.keys(y);
	for (var i = 0; i < _keys.length; i++) {
		var genre = _keys[i];
		_temp[genre] = y[genre].length;
		sum += _temp[genre];
	}
	var rand = Math.random()*sum;//[0,sum)
	var sum2 = 0;
	var _tkeys = Object.keys(_temp);
	for (var i = 0; i < _tkeys.length; i++) {
		var genre2 = _tkeys[i];
		if (sum2 < rand && sum2 + _temp[genre2] >= rand){
			random(y[genre2], genre2);
			break;
		}
		sum2 += _temp[genre2];
	}
}
function random(list, genre){
	var rand2 = Math.floor(Math.random() * (list.length/2));
	var id = list[rand2*2];
	var title = list[rand2*2 + 1];
	if ($('#nicolist_rand').prop('checked')){
		$('#randomVideo').html('');
	}
	if (!$('#random button').length){// if #random button doesn't exist
	  	$('#random').prepend($('<button>', {
	  		html: '<span>&times;</span>',
	  		'type':'button',
	  		'class':'close',
	  		'click': function(){
	  			$(this).parent().fadeOut('slow', function(){
	  				refreshStyle();
	  				$('#randomVideo').html('');
	  			});
	  		}
	  	}));
	}
	var a = $('<a>', {
		'href': getVideoURL(id),
		'target': '_blank',
		'data-genre' : genre,
		'data-id' : id,
		'data-title' : title,
		contextmenu: function(e){
			showMenu(e.pageX, e.pageY, $(this), 'random');
			return false;
		},
		'click': function(e){
			if ($('#click_action').val() !== 'official'){
				e.preventDefault();
			}
			openVideo($(this), 'random');
		}
	});
	
	var div = $('<div>',{
		'class': 'd-flex align-items-center flex-row'
	});

	var favIcon = createFavIcon(id, title);

	div.append(favIcon);

	if ($('#nicolist_thumb_res').prop('checked')){
		a.append(createThumbImgElem(id, $('#nicolist_rand').prop('checked')));
	}
	var span = $('<span>', {text:title});
	a.append(span);
	div.append(a);
	if (genre){
		div.append($('<span>', {
			text: '('+genre+')',
			'class': 'ml-2 text-muted'
		}));
	}
	div.prependTo('#randomVideo');
	$('#random').css('display', 'block');
}
function randomFromRight(){
	var list = [];
	var genre = null;
	$('#right a[data-id]').each(function(i, elem){
		list.push($(elem).attr('data-id'));
		list.push($(elem).attr('data-title'));
		if (genre == null){
			var thisGenre = $(elem).attr('data-genre');
			if (typeof thisGenre !== 'undefined' && thisGenre !== false){
				genre = thisGenre;
			}
		}
	});
	random(list, genre);
}
function refreshStyle(){
	if ($('#history').css('display') !== 'none'){
		$('#history').css({
			'top': $('#searchQuery').offset().top + $('#searchQuery').outerHeight(),
			'left': $('#searchQuery').offset().left,
			'min-width': $('#searchQuery').outerWidth()
		});
	}
}
function bytesize(str) {
	return encodeURIComponent(str).replace(/%../g, "a").length;
}
function int(str){
	var num = parseInt(str, 10);
	if (isNaN(num)){
		return parseInt(str.match(/\d+/)[0], 10);
	} else {
		return num;
	}
}
function restrBytesize(str, max){
	max = max || 50;
	if (bytesize(str)>max){
		var count = 0;
		var newstr = ''
		for (var i = 0; i < str.length; i++) {
			var chara = str.charAt(i);
			count += bytesize(chara);
			if (count > max){
				return newstr + '...';
			} else {
				newstr += chara;
			}
		}
	} else {
		return str;
	}
}
function restrLength(str, max){
	max = max || 40;
	if (str.length > max){
		return str.substring(0, max)+'...';
	} else {
		return str;
	}
}
function createThumbImgElem(id, isFullSize){
	var $img = $('<img>',{
		'src': (getThumbURL(id)),
		'alt': 'No Image',
		'class': 'mr-4 img-thumbnail loading '+(isFullSize?'full-thumb':'sm-thumb')
	});
	$img.on('load', function(){
		if ($.inArray($(this).attr('src'), loadedtn) === -1){
			loadedtn.push($(this).attr('src'));
		}
		$(this).removeClass('loading');
	});
	return $img;
}
function createStayUnloadedTNI(id, isFullSize){
	var url = getThumbURL(id);
	if ($.inArray(url, loadedtn) === -1){
		return $('<img>',{
			'data-src': url,
			'alt': 'No Image',
			'class': 'mr-4 img-thumbnail loading '+(isFullSize?'full-thumb':'sm-thumb')
		});
	} else {
		return createThumbImgElem(id, isFullSize);
	}
}
function createEmbedElem(){
	var id = playlist[playindex];
	if ((new RegExp('^sm\\d+$')).test(id)|| (new RegExp('^nm\\d+$')).test(id) || (new RegExp('^so\\d+$')).test(id) || (new RegExp('^\\d+$')).test(id)){
		setupNiconicoIframe(id);
	} else {
		setupYoutubeIframe(id);
	}
	$('#play iframe').get(0).contentWindow.ondrop = function(e){
		e.preventDefault();
		e.stopPropagation();
	}
	initPlaylistSel();

	if ($('#nicolist_loop').prop('checked')){
		$('#pcloop img').attr('src', LOOP_DATA_URL);
		$('#pcloop').attr('title', 'ループ再生を解除');
	} else {
		$('#pcloop img').attr('src', NOT_LOOP_DATA_URL);
		$('#pcloop').attr('title', 'ループ再生');
	}
	registerTooltip($('#pcloop'));
	if ($('#nicolist_cinematic').prop('checked')){
		$('#pcwidth img').attr('src', NARROW_DATA_URL);
		$('#pcwidth').attr('title', '固定サイズで表示');
	} else {
		$('#pcwidth img').attr('src', WIDEN_DATA_URL);
		$('#pcwidth').attr('title', 'ワイド画面で表示');
	}
	registerTooltip($('#pcwidth'));
}
function setupYoutubeIframe(id){
	$('#play').html('');
	var div = $('<div>',{
		'id': 'playeriframeyoutube',
	});
	$('#play').append(div);
	player = new YT.Player('playeriframeyoutube', {
		videoId: id,
		playerVars: { 'autoplay': (autoplay ? 1 : 0)},
		events: {
			'onStateChange': function(event){
				if (event.data === YT.PlayerState.ENDED){
					autoplay = true;
					next();
				} else if (autoplay && event.data === YT.PlayerState.CUED){
					player.playVideo();
					autoplay = false;
				}
			},
			'onError': function(event){
				addToDeletedVideoList(id);
				autoplay = true;
				next();
			}
		}
	});
	videoResize();
}
function setupNiconicoIframe(id){
	$('#play').html('');
	var iframeElement = $('<iframe>',{
		"id": "playeriframenicovideo",
		"src": 'https://embed.nicovideo.jp/watch/'+id+'?jsapi=1&playerId=0',
		"frameborder": "0",
		"allow": "autoplay; encrypted-media",
		"allowfullscreen": ""
	});
	$('#play').append(iframeElement);
	videoResize();
	window.onmessage = function (event) {
		if (event.origin === 'https://embed.nicovideo.jp'){
			if (event.data.eventName === 'error'){
				//if the video has been dead
				addToDeletedVideoList(id);
				autoplay = true;
				next();
			} else if (event.data.eventName === 'playerStatusChange'){
				if (event.data.data.playerStatus === 4){
					autoplay = true;
					next();
				}
			} else if (event.data.eventName === 'loadComplete'){
				if (autoplay){
					$('#play iframe').get(0).contentWindow.postMessage({eventName:'play',playerId:"0",sourceConnectorType:1}, 'https://embed.nicovideo.jp');
					autoplay = false;
				}
				//set volume
				if ($('#nicolist_savevolume').prop('checked')){
					var playing = playlist[playindex];
					if (volumemap.hasOwnProperty(playing)){
						$('#play iframe').get(0).contentWindow.postMessage({
							eventName:'volumeChange',
							playerId: "0",
							sourceConnectorType: 1,
							data: {
								volume: volumemap[playing]
							}
						}, 'https://embed.nicovideo.jp');
					}
					skip_flag = true;
				}
			} else if ($('#nicolist_savevolume').prop('checked') && event.data.eventName === 'playerMetadataChange'){
				if (skip_flag){
					skip_flag = false;
				} else {
					var v = Math.round(event.data.data.volume * 1000)/1000;
					var playing = playlist[playindex];
					if (!volumemap.hasOwnProperty(playing) || volumemap[playing] !== v){
						volumemap[playing] = v;
						localStorage.setItem('nicolist_volumemap', JSON.stringify(volumemap));
					}
				}
			}
		}
	}
}
function addToDeletedVideoList(id){
	if ($.inArray(id, deletedVideoArray) !== -1){
		deletedVideoArray.push(id);
		localStorage.setItem('nicolist_deleted', JSON.stringify(deletedVideoArray));
	}
}
function videoSize(){
	var w = $('#play').outerWidth();
	var h = Math.ceil(w * 9 / 16);
	if ($(window).height() * 0.8 < h){
		h = Math.ceil($(window).height() * 0.8);
		w = Math.ceil(h * 16 / 9);
	}
	if (w < 640 || $('#nicolist_cinematic').prop('checked')){
		return [w, h];
	} else {
		return [640, 360];
	}
}
function videoResize(){
	var s = videoSize();
	$('#play iframe').css({
		'width': s[0],
		'height': s[1]
	});
	$('#controller').css({
		'width': s[0]
	});
}
function next(){
	if (hasNext()){
		playindex++;
		refreshPlayer();
	} else {
		if ($('#nicolist_loop').prop('checked')){
			playindex = 0;
			refreshPlayer();
		}
	}
}
function hasNext(){
	return playindex > -1 && playlist.length > playindex + 1;
}
function hasPrevious(){
	return playindex > 0;
}
function previous(){
	if (hasPrevious()){
		playindex--;
		refreshPlayer();
	} else {
		if ($('#nicolist_loop').prop('checked')){
			playindex = playlist.length - 1;
			refreshPlayer();
		}
	}
}
function refreshPlayer(){
	var id = playlist[playindex];
	if ((new RegExp("^sm\\d+$")).test(id)|| (new RegExp("^nm\\d+$")).test(id) || (new RegExp("^so\\d+$")).test(id) || (new RegExp("^\\d+$")).test(id)){
		if (!isNullOrUndefined($('#play iframe').length) || $('#play iframe').attr('id') === 'playeriframeyoutube'){
			setupNiconicoIframe(id);
		} else {
			$('#play iframe').attr('src', 'https://embed.nicovideo.jp/watch/'+id+'?jsapi=1&playerId=0');
		}
	} else {
		if (!isNullOrUndefined($('#play iframe').length) || $('#play iframe').attr('id') === 'playeriframenicovideo'){
			setupYoutubeIframe(id);
		} else {
			player.loadVideoById({videoId: id});
		}
	}
	refreshController();
}
function refreshController(){
	if (hasNext() || $('#nicolist_loop').prop('checked')){
		$('#pcnext').removeClass('disabled');
	} else {
		$('#pcnext').addClass('disabled');
	}
	if (hasPrevious() || $('#nicolist_loop').prop('checked')){
		$('#pcprev').removeClass('disabled');
	} else {
		$('#pcprev').addClass('disabled');
	}
	if ($('#play').html() !== ''){
		$('#controller').removeClass('silent');
	} else {
		$('#controller').addClass('silent');
	}
	if (playlist.length > 1){
		$('#pclist').removeClass('silent');
		$('#pclist').val(playindex+'');
	} else {
		$('#pclist').addClass('silent');
	}
	$('#pcfav').html('');
	$('#pcfav').append(createFavIcon(playlist[playindex], playlistTitleMap[playlist[playindex]]).removeClass('mr-2'));
	registerTooltip($('#pcfav .favIcon'));
}
function initPlaylistSel(){
	$('#pclist').html('');
	var opt;
	for (var i = 0; i < playlist.length; i++) {
		if (playlistTitleMap.hasOwnProperty(playlist[i]) !== -1){
			opt = $('<option>', {
				text: (i+1) + ': ' + playlistTitleMap[playlist[i]],
				'value': i+''
			});
			opt.appendTo($('#pclist'));
		} else {
			//wont happen
			continue;
		}
	}
}
function reversePairList(list){
	var _list = [];
	for (var i = list.length/2 - 1; i >= 0; i--) {
		_list.push(list[2*i]);
		_list.push(list[2*i+1]);
	}
	return _list;
}
function promptWinExplorer(filename, content){
	var file = new Blob([content], {type: 'text/plane;'});
	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(file, filename);
	} else {
		var a = document.createElement('a');
		var url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}
}
function isNullOrUndefined(smthng){
	return typeof smthng === 'undefined' || smthng == null;
}
function escapeHtmlSpecialChars(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function dismissAllWarningAlerts(){
 	$('.alert-warning').fadeOut();
}
function starImg(starred){
	return (starred ? $('<img>', {
		'src' : STAR_DATA_URL
	}) : $('<img>', {
		'src' : UNSTAR_DATA_URL
	})).addClass('favIcon');
}
function startStarAnimation($elem){
	var posx = $elem.offset().left - $elem.width()/2;
	var posy = $elem.offset().top - $elem.height()/2;
	var img = $('<img>',{
		'width': '32px',
		'height': '32px',
		'src': LARGE_STAR_DATA_URL
	});
	var div = $('<div>',{
		'id': 'starAnime'
	}).css({'top':posy,'left':posx});
	div.append(img);
	$('#body').append(div);
	img.animate({width: '2px', height: '2px', opacity: 0, 'margin-left': '15px', 'margin-top': '15px'}, 300, function(){
		$('#starAnime').remove();
	});
}
function createFavIcon(id, title){
	var starIndex = -1;
	for (var j = 0; j < starred.length; j+=2) {
		var stId = starred[j];
		if (stId === id){
			starIndex = j;
			break;
		}
	}//j
	var favIcon = starImg(starIndex !== -1);
	favIcon.addClass('mr-2 pointer').attr({
		'title': 'お気に入り',
		'data-id': id,
		'data-title': title
	}).on('click', function(){
		var thisId = $(this).attr('data-id');
		var thisTitle = $(this).attr('data-title');
		toggleFav(thisId, thisTitle);
		refreshFavsLeft();
		localStorage.setItem('nicolist_star', JSON.stringify(starred));
	});
	return favIcon;
}